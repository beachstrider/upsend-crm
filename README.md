## Main features:

- **Segments** or users filters to trigger campaigns, messages and bots.
  - use build in attributes like "last sign in", "country", "nº of sessions" or provide your own attributes from your registered users.
- **Embedable Widget Messenger**
  - Embed web widget with a simple js snippet
  - Pass custom attributes to feed your segment properties
  - Secure data comunication with Encrypted data (JWE)
  - Multilanguage and Customizable color palette
- **Conversations**
  - Agent's auto assignment
  - Extensible Chat editor with many kind of blocks ie: image, code, video, embed, giphy and more.. it's based in <a href="https://github.com/michelson/Dante2">Dante2</a> editor
- **Campaigns**
  - **Newsletters** with programable scheduling and Audience target
    - track open, clicks and complaints
  - **User auto messages**, send messages to visitors through
  segments
    - track open, clicks
  - **Receive & Reply** those unreaded messages from email and deliver the directly to the chat.
  - **Set Agent's team availability**, days with their time frames.
  - **Compose Onboarding** tours to give an awesome experience on your site
    - track open, clicks and skips
    - set which url the onboarding should trigger, support patterns like /*

  All Campaigns messages are powered by Dante2, with all the bells and whistles.


- **Data enrichment**, through third parties
- **Api integrations** & pluggable integrations (currently on the works)
- **Programable bots** and composable paths of conversations
- **Report dashboard** with visits avg response & resolution times
- **Help Center/ Knowledge base** in the box
  - Create articles & collections
  - multilanguage


## Development

Before you get started, ensure you have the following minimum versions: [Ruby 2.6+](https://www.ruby-lang.org/en/downloads/), [PostgreSQL 10+](https://www.postgresql.org/download/), [Redis 2.6+](https://redis.io/download).


# System Dependencies

* OS - Ubuntu 14.04/higher OR CentOS 6/7
* RVM
* Ruby 2.6.5
* Rails 5.2.3
* Git 2.16.3 or latest version
* DB- PostgreSQL 10.x or higher
* Redis - 2.6 or higher

# App Setup

Execute following rake:
* rake db:create RAILS_ENV=XXX
* pg_restore --verbose --clean --no-acl --no-owner -U yourdbusername -h localhost -d hermes latest.dump(For Dev ENV)


## .env file

  * WS=wss://localhost:3000
  * SNS_CONFIGURATION_SET=
  * SES_ADDRESS=
  * SES_USER_NAME=
  * SES_PASSWORD=
  * AWS_ACCESS_KEY_ID=
  * AWS_SECRET_ACCESS_KEY=
  * AWS_EMAIL_SERVER_ZONE=
  * AWS_SES_REGION='us-west-2'
  * AWS_S3_BUCKET=
  * AWS_S3_REGION=us-west-2
  * S3_BUCKET_CONVERSATION_PREFIX=emails
  * FULLCONTACT_TOKEN=
  * STRIPE_API_VERSION= 2020-03-02
  * STRIPE_PUBLISHABLE_KEY=
  * STRIPE_SECRET_KEY=
  * STRIPE_SIGNING_SECRET1=
  * S3_INBOUND_EMAILS_BUCKET=
  * TRIAL_DAYS=1
  * support_email=xyz@domain.io
  * WHM_RESTRICTED_TOKEN=
  * WHM_HOST=upsend.io
  * WHM_USERNAME=upsend
  * SES_INBOUND_SMTP_ADDRESS=inbound-smtp.us-west-2.amazonaws.com

1. WHM environment varialbes are used to add MX record for subdomain using cpanel API. The purpose is to make inbound emails work using SNS notifications. They are optional for local machine.
2. Db seed file will create a free plan for development purpose. But If you want to create all the stripe plans in local machine then configure stripe env variables with your account credentials and run rake stripe_plans:create && rake stripe_metered_plans:create

## Automated Testing Setup(Comming Soon)

## Production (Comming Soon)

## Requirements

Upsend is built for the *next* 10 years of the Internet, so our requirements are high:

| Browsers              | Tablets      | Phones       |
| --------------------- | ------------ | ------------ |
| Safari 10+            | iPad 4+      | iOS 10+      |
| Google Chrome 57+     | Android 4.4+ | Android 4.4+ |
| Internet Explorer 11+ |              |              |
| Firefox 52+           |              |              |

## Built With

- [Ruby on Rails](https://github.com/rails/rails) &mdash; Our back end API is a Rails app. It responds to requests RESTfully in JSON.
- [React.js](https://github.com/react/react.js) &mdash; Our front end is an React.js app that communicates with the Rails Graphql API.
- [PostgreSQL](https://www.postgresql.org/) &mdash; Our main data store is in Postgres.
- [Redis](https://redis.io/) &mdash; We use Redis as a cache and for transient data.

Plus *lots* of Ruby Gems, a complete list of which is at [/master/Gemfile](https://github.com/uniquesolution29/upsend-crm/blob/master/Gemfile).


