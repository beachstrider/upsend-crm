# frozen_string_literal: true

class ApplicationMailer < ActionMailer::Base
  default from: 'contact@upsend.io'
  layout 'mailer'
end
