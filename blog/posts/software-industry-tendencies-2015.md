---
title: Tendencies and services already happening for the software industry
description: 'A 2015 look at software industry trends: data-driven UI, continuous delivery, microservices, real-time tools, and consumer-style enterprise software.'
draft: false
date: 2015-07-27
updated: ''
author: eduardo-lopez
topics:
  - software-development
image: /assets/blog/working-setup5.webp
imageAlt: Laptop open with clear view in the background, from an open space office.
takeaways: []
faq: []
originalUrl: https://medium.com/icalia-labs/tendencies-and-services-already-happening-for-the-software-industry-52b4cf7cb720
originalLanguage: ''
---

As a company, we are very clear about what we do and the value we provide to our clients. The type of service we deliver is completely related to software product development.

We have rejected opportunities for alternative revenue streams such as training, consultancy, and reverse engineering analysis, among others. The reason for rejecting them is to be able to continuously improve our understanding of our company’s core, not focusing on other verticals until the right moment to develop a new and fresh business proposal.

Nevertheless, focusing on our core demands adapting to change very quickly. During the last year, we have seen, both from clients and at massive tech events ([Collision](http://collisionconf.com), [EmberConf](http://emberconf.com/), and others), new approaches to solving things and tendencies that are already part of the modern software we see in production environments.

## New AI and Engineering challenges for UI design

The last decade has been a great time for generating more and more data. Hardware capabilities and more tracking sources and tools are helping to convert [dark data](https://en.wikipedia.org/wiki/Dark_data) into valuable information for the end user. Also, the visual design and presentation of digital products differentiate the most capable teams and companies, providing unique experiences.

The merging of data and design is a new challenge. Designing interfaces, screens, and a complete application demands caring about the data we have available and [how to present it properly to the right user consuming it](http://www.fastcodesign.com/3047199/apple-finally-learns-ai-is-the-new-ui). Dashboards and Information Feeds need to present what the user cares about and let her make decisions properly and faster than before. This is what we are seeing as Personalization (P13N). P13N helps to better understand the user, make predictions, discover patterns, and enhance what the user is looking at on the screen. Understanding every user’s past will help to better predict the future and show what they will care about.

![Person in glasses resting their chin on one hand while looking at a blurred computer monitor](/assets/blog/software-industry-tendencies-2015-1.webp)

> Data < Information < Dashboards & Feeds < P13N < Predictions and Patterns

As an engineering challenge, there are new emerging opportunities for building typical static content sites, something every company incorporates by default. Big companies are facing problems with high bounce rates, low engagement, or poor experience, not due to visual design, but because of technical elements affecting their performance. Many tools that have existed throughout the new digital era, such as [WordPress](https://wordpress.com/), [Joomla](http://www.joomla.org/), or now website builders like [Squarespace](http://www.squarespace.com/) or [Wix](http://www.wix.com), help you build an [MVP](https://en.wikipedia.org/wiki/Minimum_viable_product) or a site that won’t be accessed by many users. Once you reach a decent number of users, effectively loading every section and piece of content, having decoupled modules and few dependencies, and providing the best experience become reachable by balancing design with engineering efforts. For example, building a complete mobile client-side application for a company website [helps to provide a better experience](https://web.archive.org/web/20150721054302/http://www.ereachconsulting.com:80/5-benefits-of-a-mobile-website/) by loading and organizing assets in a better way, loading the information you need, and providing an interaction very similar to what we see in mobile applications.

## Continuous Delivery practices on steroids

Today, building a product from scratch demands basic knowledge of [Development Operations](https://en.wikipedia.org/wiki/DevOps) (DevOps) from every developer. [Many companies providing solutions as PaaS and IaaS](http://www.tomsitpro.com/articles/cloud-computing-solutions,1-1755.html) are helping technical teams deliver software faster than ever before, so companies starting new products can easily adopt these types of solutions.

Maintaining a production platform demands different types of knowledge. There comes a point when the team needs to administer its infrastructure on its own, but that is much less of a pain now than it was before. Tools like [Docker](https://www.docker.com/) and container technology offer a software framework to manage all hardware and forget about configuration every time you want to run the application in a new environment or on a new server. For these types of applications, we will see a particular team dedicated to development and another, smaller team dedicated to operations, both communicating better, performing efficiently, and delivering value faster than before.

There can also be challenges with deploying technology on the client’s side. Regulations and company bureaucracy can make implementing a continuous delivery process more complicated, compared to infrastructure running entirely on the Internet. Even though containers and platforms allow deploying services rather than the entire product, integrating tests and establishing a particular procedure for every organization is the best way to go in order to reduce the time it takes to deliver a new feature or version of the product. A [Continuous Delivery](https://en.wikipedia.org/wiki/Continuous_delivery) process is imperative, and possible even when facing a lot of constraints such as compliance or governance.

For the mobile world, there are still many things to come, and the web context in particular needs to be a reference for all the new devices that will open [marketplaces](https://web.archive.org/web/20180310162155/https://marketplace.thingworx.com/) and software tools for the end user.

## Every feature as a microservice

Software is easier to manage if you treat all features as services.

Features become isolated; thus, software becomes decoupled and cohesive. Teams can easily focus on features and be responsible for that particular piece; if something is broken, the feature team can fix it easily. Deploying a product becomes healthier, because you can deploy every section of your software asynchronously, depending not on the environment but on the process and teams.

The microservices approach as a default way to build software products is important to reduce [software erosion](https://en.wikipedia.org/wiki/Software_rot) and technical debt in the long term. We are seeing more and more teams adopting this mantra to manage and build their products.

Though this is nothing new, it is now an important topic due to growth in both client-side technologies and new physical and virtual interfaces from IoT, self-driving cars, and wearable devices. We can take as a reference Jeff Bezos, who in 2002 exhorted his team to [build everything inside Amazon as a service](http://apievangelist.com/2012/01/12/the-secret-to-amazons-success-internal-apis/), because of the benefits for managing the company in terms of technology and communication.

## Tools for concurrency in production environments

Every day, more and more people are getting access to the Internet for the first time. New services and products on the Internet provide more options and help the consumer select the best fit for their needs.

With many more applications to come, but also many more users accessing products over the Internet infrastructure, providing equal service and attention to every user is very important for every company, and for the consumer. A truly connected world means having access to the right information you need in real time. Combining equal service for every user with real-time interaction demands implementing new tools that properly support both.

For databases, we are talking about tools that can generate and provide data very fast. For the back end, we are talking about [streaming APIs](http://loopback.io) and lean tools that can be easily maintained and also allow multiple connections without sacrificing the service provided to users already connected. We will see more production applications with [Go](https://golang.org/) and [Elixir](http://elixir-lang.org/) because of the stability they provide and their great handling of threads and processes. Finally, on the front-end engineering side, we are talking about tools that allow and simulate complete real-time interaction, as the mobile world has implicitly established in other technology contexts.

## Consumerization of the Enterprise

Compared to other types of applications, enterprise solutions are used more frequently, due to employee dependency on them. A single employee in the Human Resources department will be using an application to arrange and organize all of her tasks, generate reports for the management tier, or follow up on every new candidate applying for a job opportunity — every single day. Enterprise tools with poor usability and bad interactions that have been built without considering the end user have a dangerous impact on [motivation, productivity, and happiness](http://www.forbes.com/sites/kaviguppta/2015/07/21/how-software-will-transform-employee-engagement/).

Consumer-oriented organizations are helping and inspiring big businesses to [move rapidly and adapt more of their practices for the benefit of the business clients](https://blog.asana.com/2015/02/designing-enterprise-vs-consumer-products-isnt-different-think/). Adobe, PayPal, and AOL [use Slack](http://venturebeat.com/2014/05/08/5-reasons-slack-will-change-the-workplace/) for a leaner and better communication approach, both internally and to manage engagement.

![KPCB presentation slide showing an April 2015 tweet by Aaron Levie about enterprise software transforming work itself](/assets/blog/software-industry-tendencies-2015-2.webp)
*Source: KPCB.*

## B2B acquiring elements from B2C

B2B product areas such as Marketing, Sales, and Customer Support are taking B2C models as a reference.

For sales, we are seeing more [subscription models on robust platforms](https://www.pinterest.com/Mr_Ed/top-saas-pricing-pages/). No fees when you decide to stop using the service, no licenses, no long-term contracts. With businesses expecting a more organic sales process and investing in referrals from partners and from clients of their current clients, the way businesses operate on the Internet nowadays is more similar to the way consumer products have been commercialized.

For marketing, we are seeing businesses being advertised on social networks, sharing content, and doing inbound marketing as if they were small companies looking to build startup cultures.

Customer Support is also a very important area adapting from the B2C model. The faster and more direct the service can be, the better. Having a humanized relationship with every single client and keeping a lean communication channel will help business providers keep building a better tool on a frequent basis, with higher value.

Software providers need to care about all these things in order to keep adding the value our clients are seeking, reduce technical debt, and deliver a quality service with great time-to-market and execution as a priority.

*Do you see other tendencies already happening? I would be glad to start a conversation about alternative services being incorporated in the software industry by any provider. Send me an email at edolopez@icalialabs.com or a tweet at @edolopez.*
