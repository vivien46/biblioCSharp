# Étape 1 : compilation (image SDK, jetée après le build)
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src
COPY Server.csproj ./
RUN dotnet restore "Server.csproj"
COPY . .
RUN dotnet publish "Server.csproj" -c Release -o /app/publish --no-restore

# Étape 2 : image finale légère (runtime ASP.NET uniquement)
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS final
WORKDIR /app
COPY --from=build /app/publish ./
ENV ASPNETCORE_URLS=http://+:5263
EXPOSE 5263
ENTRYPOINT ["dotnet", "Server.dll"]
