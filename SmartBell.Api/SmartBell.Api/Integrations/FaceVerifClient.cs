using System.Text.Json;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using System.IO;
using System.Net.Http;
using System;
using System.Collections.Generic;
using System.Linq;

// Namespace'i SmartBell.Api.Integrations olarak güncelledik
namespace SmartBell.Api.Integrations 
{
    // --- DTO (Data Transfer Object) Classes ---
    
    // Yüz Kaydı (Enrollment) ve Doğrulama (Verification) sırasında Python'dan Embedding vektörünü almak için kullanılır.
    public record FaceEmbeddingResponse(
        bool Success, 
        string Message, 
        List<float> Embedding
    );

    // Doğrulama (Verification) işlemi için Python'a gönderilen istekte kullanılacak DTO
    public record VerificationRequest(
        List<float> KnownEmbedding, 
        List<float> LiveEmbedding
    );
    
    // Doğrulama (Verification) işlemi sonucunda Python'dan Similarity Score almak için kullanılır.
    public record FaceVerificationScore(
        bool Success,
        double Similarity_score,
        string Status
    );


    public class FaceVerificationClient
    {
        // Python Microservice local address (local makinede 8000 portunda çalışıyor)
        private const string BaseUrl = "http://127.0.0.1:8000"; 
        private readonly HttpClient _httpClient; 

        // Get HttpClient with Dependency Injection (DI) 
        public FaceVerificationClient(HttpClient httpClient) 
        {
            _httpClient = httpClient; 
            _httpClient.BaseAddress = new Uri(BaseUrl);
        }

        // --- 1. EMBEDDING ÇIKARMA ---
        public async Task<FaceEmbeddingResponse> GetEmbeddingAsync(Stream imageStream, string fileName)
        {
            using var formData = new MultipartFormDataContent();   //created a form object, it's used for send file and text data together through http
                                                                  //using var: clean the formData from memory automatically when process over
            var fileContent = new StreamContent(imageStream);     //convert image file into http content 
            fileContent.Headers.ContentType = new MediaTypeHeaderValue("image/jpeg");  //set the content type as image 
            formData.Add(fileContent, "file", fileName);   //add this http content to formData

            // Python Microservice'te /get_embedding endpoint'i çağrılır
            var response = await _httpClient.PostAsync("/get_embedding", formData);    //endpoint adı değişebilir microservisteki kısım düzenlenecek
            var jsonResponse = await response.Content.ReadAsStringAsync(); 

            if (!response.IsSuccessStatusCode)
                throw new HttpRequestException($"Microservice Error (Get Embedding): {jsonResponse}");

            var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };

            var embeddingResult = JsonSerializer.Deserialize<FaceEmbeddingResponse>(jsonResponse, options)
                                ?? throw new HttpRequestException("Invalid JSON from microservice (embedding).");

            if (!embeddingResult.Success || embeddingResult.Embedding == null || !embeddingResult.Embedding.Any())
            {
                throw new Exception(embeddingResult.Message ?? "Face not detected in the image.");
            }

            return embeddingResult;
        }


        // --- 2. DOĞRULAMA (SIMILARITY SCORE) HESAPLAMA ---
        public async Task<FaceVerificationScore> CalculateSimilarityAsync(List<float> knownEmbedding, List<float> liveEmbedding)
        {
            var requestDto = new VerificationRequest(knownEmbedding, liveEmbedding);   //creat a dto that include both of embeddings
            
            var content = new StringContent(JsonSerializer.Serialize(requestDto), 
                                            System.Text.Encoding.UTF8, 
                                            "application/json");

            // Python Microservice'te /calculate_similarity endpoint'i çağrılır
            var response = await _httpClient.PostAsync("/calculate_similarity", content);    //endpoint adı değişebilir microservisteki kısım düzenlenecek
            var jsonResponse = await response.Content.ReadAsStringAsync(); 

            if (!response.IsSuccessStatusCode)
                throw new HttpRequestException($"Microservice Error (Similarity): {jsonResponse}");

            var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };

            var scoreResult = JsonSerializer.Deserialize<FaceVerificationScore>(jsonResponse, options)
                                ?? throw new HttpRequestException("Invalid JSON from microservice (score).");
            
            return scoreResult;
        }
    }
}