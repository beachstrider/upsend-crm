# frozen_string_literal: true

require 'open-uri'

class Api::V1::HooksController < ActionController::API
  def create
    # get amazon message type and topic
    amz_message_type = request.headers['x-amz-sns-message-type']
    amz_sns_topic = request.headers['x-amz-sns-topic-arn']

    # return unless !amz_sns_topic.nil? &&
    # amz_sns_topic.to_s.downcase == 'arn:aws:sns:us-west-2:867544872691:User_Data_Updates'
    request_body = JSON.parse request.body.read
    # if this is the first time confirmation of subscription, then confirm it
    if amz_message_type.to_s.downcase == 'subscriptionconfirmation'
      send_subscription_confirmation request_body
      render(plain: 'ok') && return
    end 
    if (amz_message_type == 'Notification') || (request_body['Type'] == 'Notification')
      if request_body['Subject'] == 'Amazon SES Email Receipt Notification'
        process_email_notification(request_body['Message'])
        render(plain: 'ok') && return
      end

      if request_body['Message'] == 'Successfully validated SNS topic for Amazon SES event publishing.'
        render(plain: 'ok') && return
      else
        process_event_notification(request_body)
        render(plain: 'ok') && return
      end
    end

    # process_notification(request_body)
    render(plain: 'ok') && return
  end

  private

  # TODO: add some tests mdfk!

  def process_email_notification(message) 
    json_message = JSON.parse(message) 
 
    json_message['receipt']
    json_message['mail']['headers'].map { |o| { o['name'] => o['value'] } } 
    json_message['receipt']['action'] 
    action = json_message['receipt']['action'] 
    mid = json_message['mail']['messageId'] 
    bucket = ENV['S3_INBOUND_EMAILS_BUCKET']
    key =  ENV['S3_BUCKET_CONVERSATION_PREFIX'] + "/" + mid 

    file = AWS_CLIENT.get_object(
      bucket: bucket,
      key: key
    )

    mail       = Mail.read_from_string(file.body.read)
    from       = mail.from # ["xx@domain.com"]  
    to         = mail.to
    recipients = mail.recipients # ["reply+aaa@upsend.io"]  
    message    = EmailReplyParser.parse_reply(mail.text_part.body.to_s).gsub("\n", '<br/>').force_encoding(Encoding::UTF_8)
    from_address = from.first 
    recipient_address = recipients.first
    
    if recipient_address.starts_with?("reply")
      #"reply+aaa@app-subdomain.upsend.io"
      recipient_parts = URLcrypt.decode(recipient_address.split('@').first.split('+').last)
    else
      recipient_parts = recipient_address.split('@').first.split('+')
    end
    
    parts = recipient_parts.split('+') 

    is_reply = parts.size > 1 ? true : false
    if is_reply
      app_id, conversation_id = parts
      app = App.find(app_id)
      conversation = app.conversations.find(conversation_id) 
      new_conversation = false
    else
      app_id =  recipient_parts.first
      app = App.where('lower(key) = ?', app_id.downcase).first 
      new_conversation = true
    end

    messageId = json_message['mail']['messageId'] 
    from = app.agents.find_by(email: from.first) || app.app_users.find_by(email: from.first) 

    if new_conversation 
      if from.blank?
        from = app.add_user(email: from_address)
      end 
        options = {
          from: from,
          participant: nil,
          message: {
            html_content: message
          }
        }
      conversation = app.start_conversation(options)
    else
      opts = {
        from: from,
        message: {
          html_content: message
        },
        email_message_id: mail.message_id
      } 
      conversation.add_message(opts)
    end
  end

  def process_event_notification(request_body)
    message = parse_body_message(request_body['Message'])  
    return if message['eventType'].blank?
    track_message_for(message['eventType'].downcase, message)
  end

  def parse_body_message(body)
    JSON.parse(body) 
  end

  def track_message_for(track_type, m)
    SnsReceiverJob.perform_later(track_type, m, request.remote_ip)
  end

  def send_subscription_confirmation(request_body)
    subscribe_url = request_body['SubscribeURL']
    return nil unless !subscribe_url.to_s.empty? && !subscribe_url.nil? 
    open subscribe_url
  end
  
end
