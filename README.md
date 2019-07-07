# Simple BasketService API on ASP.NET Core

A simple basket micro-service API built on ASP.NET Core with Akka.NET.

## Prerequisites

- ASP.NET Core 2.0 Runtime

## Installation

```bash
dotnet restore
```

## Starting the API

The API can be started using:

```bash
dotnet run -p ./src/BasketService/BasketService.csproj
```

## Run tests

The tests can be run using:

```bash
dotnet test ./test/BasketServiceTests/BasketServiceTests.csproj
```

## API Usage

Getting the product list: `GET - http://localhost:5000/products`.

Getting the contents of a basket: `GET - http://localhost:5000/baskets/1`.

Add an item to the basket: `PUT - http://localhost:5000/baskets/1/items` with JSON body:

```json
{
	"productId": 1000,
	"amount": 1
}
```

Remove an item from the basket: `DELETE - http://localhost:5000/baskets/1/items/{basketItemGUID}`.



