using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using Microsoft.OpenApi.Models;
using Swashbuckle.AspNetCore.SwaggerGen;
using System.Collections.Generic;
using System.Linq;

namespace SmartBell.Api.Swagger
{
    // Bu filter: IFormFile parametrelerini multipart/form-data olarak Swagger'a ekler
    public class FileUploadOperationFilter : IOperationFilter
    {
        public void Apply(OpenApiOperation operation, OperationFilterContext context)
        {
            // Formdan gelen parametreleri filtrele
            var formParams = context.ApiDescription.ParameterDescriptions
                .Where(p => p.Source == BindingSource.Form)
                .ToList();

            if (!formParams.Any())
                return;

            // RequestBody yoksa oluştur
            operation.RequestBody ??= new OpenApiRequestBody();
            operation.RequestBody.Content ??= new Dictionary<string, OpenApiMediaType>();

            var schema = new OpenApiSchema
            {
                Type = "object",
                Properties = new Dictionary<string, OpenApiSchema>(),
                Required = new HashSet<string>()
            };

            foreach (var param in formParams)
            {
                // IFormFile veya IFormFile[] tiplerini tespit et
                var propType = param.ModelMetadata?.ModelType ?? param.Type;
                var isFile = typeof(IFormFile).IsAssignableFrom(propType) ||
                             typeof(IFormFile[]).IsAssignableFrom(propType);

                // Dosya ise binary format, değilse string
                schema.Properties.Add(param.Name, new OpenApiSchema
                {
                    Type = "string",
                    Format = isFile ? "binary" : null
                });

                if (param.IsRequired)
                    schema.Required.Add(param.Name);
            }

            // Multipart/form-data olarak Swagger'a ekle
            operation.RequestBody.Content["multipart/form-data"] = new OpenApiMediaType
            {
                Schema = schema
            };
        }
    }
}
