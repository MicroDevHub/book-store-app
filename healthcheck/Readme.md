# HeathCheck module

Health is really important. There is a popular saying that health is wealth — his is true even in software engineering. Yes! Like living things, an application can be broken too if we do not take care of it.

Health checks in software help us identify inefficiencies in our applications to better maintain them.

Much like how we see a doctor to know if anything is wrong with us, right, the same principle applies to software as we pay attention to the server or response time, as one example.
## Requirements

We will implement a basic Node.js health check. Here’s what’s necessary to follow along:

Node.js installed on your machine (this comes with Node package manager)
An integrated development environment (IDE)
Why you need to have health checks
As we have already mentioned in the introduction; health is wealth. Before we jump into how to implement health check in Node.js, let’s talk about its importance and why you should get into the habit of performing these checks.

We first need to acknowledge that the availability of software or functionality is extremely important. Routine health checking of the availability of APIs, for instance, helps you learn of crucial issues and remediate them as quickly as possible.

If downtime occurs, the application owner can be informed immediately so that there is a speedy resolution to it.

Health checks become even more important as the infrastructure of our software grows, and the need to make sure that all microservices and endpoints are working flawlessly becomes more vital for the apps we manage.

Some of the things we check when considering the health of software in any programming language or stack are the response time of a server when a request is made and how the server connects to the database (if there is one).

Another reason why a health check is necessary is to maintain the availability of your services. Your application or product should not be seen as the one that has the most downtime among its competitors — it is bad for business, and a good name is better than fortune, as they say.

## Implementing a health check in Node.js

Connect  to me when you really want to implement it. :sunglasses: :sunglasses: