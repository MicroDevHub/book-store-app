![OpenAPI-Swagger](../../assets/OpenAPI-Swagger.png)

## Swagger module

[**Section 1: Overview about Open API specification and Swagger**](./swagger-1-overview.md)

[Section 2: Open API specification](./swagger-2-openAPI.md)

# Sections 1: Overview about open API specification and Swagger

## Table of contents

1. API first approach
2. What is OpenAPI?
3. What is Swagger?
4. Clarifying Swagger vs OpenAPI
5. References.

## 1. API first approach

An `API-first approach` means that for any given development project, your APIs are treated as “first-class citizens.”

An `API-first` approach to building products provides many benefits, including but not limited to:

- Development teams can work in parallel
- Reduces the cost of developing apps
- Increases the speed to market
- Ensures good developer experiences
- Reduces the risk of failure

## 2. What is OpenAPI?

`OpenAPI Specification` (formerly Swagger Specification) is an API description format for REST APIs. An OpenAPI file
allows you to describe your entire API, including:

- Available endpoints (/users) and operations on each endpoint (GET /users, POST /users)
- Operation parameters Input and output for each operation
- Authentication methods
- Contact information, license, terms of use and other information.

API's specifications can be written in YAML or JSON. The format is easy to learn and readable to both humans and machines.

## 3. What is Swagger?

Swagger is the largest framework for designing APIs using a common language and enabling the development across the
whole API lifecycle, including documentation, design, testing, and deployment

The framework provides a set of tools that help programmers generate client or server code and install
a self-generated documentation for web services

## 4. Let's start with clarifying Swagger vs OpenAPI
The easiest way to understand the difference is:

- OpenAPI = Specification

- Swagger = Tools for implementing the specification

The OpenAPI is the official name of the specification. The development of the specification is fostered by the OpenAPI Initiative, which involves more the 30 organizations from different areas of the tech world — including Microsoft, Google, IBM, and CapitalOne. Smartbear Software, which is the company that leads the development of the Swagger tools, is also a member of the OpenAPI Initiative, helping lead the evolution of the specification.

Swagger is the name associated with some of the most well-known, and widely used tools for implementing the OpenAPI specification. The Swagger toolset includes a mix of open source, free, and commercial tools, which can be used at different stages of the API lifecycle.

These tools include:

- Swagger Editor: Swagger Editor lets you edit OpenAPI specifications in YAML inside your browser and to preview documentations in real time.
- Swagger UI: Swagger UI is a collection of HTML, Javascript, and CSS assets that dynamically generate beautiful documentation from an OAS-compliant API.
- Swagger Codegen: Allows generation of API client libraries (SDK generation), server stubs and documentation automatically given an OpenAPI Spec.
- Swagger Parser: Standalone library for parsing OpenAPI definitions from Java
- Swagger Core: Java-related libraries for creating, consuming, and working with OpenAPI definitions
- Swagger Inspector (free): API testing tool that lets you validate your APIs & generate OpenAPI definitions from an existing API
- SwaggerHub (free and commercial): API design and documentation, built for teams working with OpenAPI.

Since the Swagger tools were developed by the team involved in the creation of the original Swagger Specification, the tools are often still viewed as being synonymous with the spec. But the Swagger tools are not the only tools that are available for implementing the OpenAPI Specification. There are a wide variety of API design, documentation, testing, management, and monitoring solutions that support version 2.0 of the specification, and are actively working on adding 3.0 support.


## 5. References:
- https://swagger.io/resources/articles/adopting-an-api-first-approach/
- https://swagger.io/docs/specification/about/
- https://www.cvsimply.com/
- http://getbem.com/