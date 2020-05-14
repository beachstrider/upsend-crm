# frozen_string_literal: true

class ChatNotifierMailer < ApplicationMailer
  include Roadie::Rails::Mailer

  def notify(conversation_part)

    headers 'X-SES-CONFIGURATION-SET' => ENV['SNS_CONFIGURATION_SET']
    headers 'X-CHASKIQ-PART-ID' => conversation_part.id

    @conversation_part = conversation_part
    conversation = conversation_part.conversation
    app          = conversation.app
    @app_key = app.key
    @conversation_key = conversation.key
    @app_name = app.name
    @app_logo = app.logo_url
    
    # admin_users  = app.agents # set assignee !

    message_author = conversation_part.app_user
    @author_name  = message_author.display_name 
    @author_name  = message_author.email.split('@').first if @author_name.blank?

    @author_email = message_author.email
    recipient = message_author.id != conversation.main_participant.id ?
    conversation.main_participant : conversation.assignee

    @user_id =  recipient.id

    content_type  = 'text/html'
    from_name     = "#{@author_name} [#{app.name}]"

    return if recipient.blank?

    outgoing_email_domain = app.app_outgoing_email_domain_by_upsend

    raise 'no outgoing_email_domain on app' if outgoing_email_domain.blank?

    ## TODO: configurability of email
    crypt         = URLcrypt.encode("#{app.id}+#{conversation.id}")
    #outgoing_email_domain = app.outgoing_email_domain 
    #from_email    = "messages+#{crypt}@#{outgoing_email_domain}"
    #reply_email = from_email
    from_email    = "#{@author_name}@#{outgoing_email_domain}"
    #reply_email = "messages+#{crypt}@#{outgoing_email_domain}"
    reply_email = "#{from_name}<reply+#{crypt}@#{outgoing_email_domain}>"
 

    email         = recipient.email
    subject       = "new message from #{app.name}"
 

 
    return if email.blank?

    options = { 'In-Reply-To' => reply_email }

    # get previous 2 message ids
    reference_ids = conversation.messages
                                .order('id desc')
                                .where
                                .not(email_message_id: nil)
                                .limit(2)
                                .map(&:email_message_id)
                                .map { |o| "<#{o}>" }.join(' ')

    options.merge!('References' => reference_ids) unless reference_ids.blank?
    headers options
    
    template = recipient.is_a?(Agent) ? 'agent_notify' : 'notify'
 
    return if recipient.is_a?(Agent) && (recipient.bot? && !recipient.enable_deliveries)
 
    roadie_mail(from: "#{from_name}<#{from_email}>",
         to: email,
         subject: subject,
         content_type: content_type,
         return_path: reply_email,
         reply_to: reply_email,
        ) do |format|
          format.html { render "chat_notifier_mailer/#{template}" }
          #format.text # assuming you want a text fallback as well
        end
  end
end
