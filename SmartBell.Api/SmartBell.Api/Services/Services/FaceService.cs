using SmartBell.Api.Data.Repositories;
using SmartBell.Api.Domain.Entities;
using SmartBell.Api.Services.Interfaces;
using SmartBell.Api.Integrations; // FaceVerificationClient için
using System.Text.Json; // JSON serileştirme/deserileştirme için
using System.IO;

namespace SmartBell.Api.Services.Services;

public class FaceService : IFaceService
{
    private readonly FaceVerificationClient _faceClient;
    private readonly IGenericRepository<FaceRec> _faceRepository;

    /// <summary>
    /// Servis bağımlılıklarını Constructor Injection ile alır.
    /// </summary>
    public FaceService(
        FaceVerificationClient faceClient,
        // IGenericRepository<T> (T = FaceData) enjekte ediyoruz.
        IGenericRepository<FaceRec> faceRepository) 
    {
        _faceClient = faceClient;
        _faceRepository = faceRepository;
    }

    /// <summary>
    /// Python'dan embedding'i çeker ve DB'ye kaydeder.
    /// </summary>
    public async Task<bool> EnrollAndSaveFaceAsync(
        Guid reservationId, 
        string bookingCode,
        Stream imageStream, 
        string fileName)
    {
        // 1. Python Servisine Embedding Çıkarma isteği gönder
        var embeddingResponse = await _faceClient.GetEmbeddingAsync(imageStream, fileName);

        // C# List<float> yapısını JSON string'e çevirerek DB'de saklanmaya hazır hale getir.
        string embeddingJson = JsonSerializer.Serialize(embeddingResponse.Embedding);

        // 2. DB'ye Kaydet/Güncelle
        
        // Aynı BookingCode için daha önce kayıt var mı kontrol et (Güncelleme/Üzerine Yazma)
        var existingData = await _faceRepository.FirstOrDefaultAsync(f => f.BookingCode == bookingCode); //--> IGenaricRepository de güncelleme istedi
    

        if (existingData != null)
        {
            // Var olan kaydı güncelle
            existingData.EmbeddingJson = embeddingJson;
            existingData.CreatedAt = DateTime.UtcNow;
            _faceRepository.Update(existingData); 
        }
        else
        {
            // Yeni kayıt oluştur
            var faceData = new FaceRec
            {
                ReservationId = reservationId,
                BookingCode = bookingCode,
                EmbeddingJson = embeddingJson,
                CreatedAt = DateTime.UtcNow
            };
            await _faceRepository.AddAsync(faceData);
        }

        // Değişiklikleri veritabanına kaydet
        await _faceRepository.SaveChangesAsync();

        return true;
    }

    /// <summary>
    /// Canlı görüntüyü kayıtlı veriyle karşılaştırarak kimlik doğrulaması yapar.
    /// </summary>
    public async Task<(bool IsVerified, double Score, string Status)> VerifyFaceAsync(
        string bookingCode, 
        Stream liveImageStream, 
        string fileName)
    {
        // 1. DB'den kayıtlı Embedding'i (KnownEmbedding) BookingCode ile çek
        var enrolledFaceData = await _faceRepository.FirstOrDefaultAsync(
            f => f.BookingCode == bookingCode);

        if (enrolledFaceData == null)
        {
            // Bu hata, Controller'da özel olarak yakalanıp 404 NotFound döndürülmelidir.
            throw new Exception($"No enrolled face found for booking code: {bookingCode}."); 
        }
        
        // JSON string'i List<float>'a geri çevir (Kayıtlı Vektör)
        var knownEmbedding = JsonSerializer.Deserialize<List<float>>(enrolledFaceData.EmbeddingJson) 
                             ?? throw new Exception("Failed to deserialize enrolled embedding from DB.");

        // 2. Canlı Görüntüden Embedding Çıkar (LiveEmbedding)
        var liveEmbeddingResponse = await _faceClient.GetEmbeddingAsync(liveImageStream, fileName);
        var liveEmbedding = liveEmbeddingResponse.Embedding;

        // 3. İki Embedding'i Python Servisine Doğrulama (Similarity) için gönder
        var verifyScore = await _faceClient.CalculateSimilarityAsync(knownEmbedding, liveEmbedding);
        
        // Eşik Değer (Threshold) Kontrolü (Örnek değer)
        const double THRESHOLD = 0.5; 
        
        bool isVerified = verifyScore.Similarity_score >= THRESHOLD;
        string status = isVerified ? "Match" : verifyScore.Status ?? "Below Threshold";

        return (isVerified, verifyScore.Similarity_score, status);
    }
}