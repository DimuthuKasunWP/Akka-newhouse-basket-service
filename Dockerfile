FROM microsoft/dotnet:2.0.0-runtime
COPY output/ /root/
ENV ASPNETCORE_URLS http://*:5000
ENV ASPNETCORE_ENVIRONMENT Production
EXPOSE 5000
WORKDIR /root/
ENTRYPOINT dotnet NewhouseIT.BasketService.dll
