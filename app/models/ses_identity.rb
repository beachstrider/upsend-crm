class SesIdentity < ApplicationRecord

  belongs_to :agent
  belongs_to :app


  def fetch_verified_addresses
    #ses.addresses.list.result
    resp = ses_client.list_email_identities
    resp.email_identities.map &:identity_name 
  end

  def add_to_aws_ses 
    begin
      ses = ses_client
      # response = ses_client.create_email_identity(email_identity: email_address)

      # if response.identity_type == "DOMAIN"
      #   tokens = response.dkim_attributes.tokens 
      #   self.dkim_tokens = tokens.to_json
      # end 
      if identity_type == "domain"
        ##Verify
        verification_response = ses.verify_domain_identity({domain: address})
        self.verification_token = verification_response.verification_token
        ##Fetch DKIM attrs
        dkim_response = ses.get_identity_dkim_attributes(identities: [address])
        tokens = dkim_response.dkim_attributes.values.first.dkim_tokens
        self.dkim_tokens = tokens.to_json
      elsif identity_type == "email"
        ses.verify_email_identity({email_address: address}) 
      end
    rescue => e
      p "ERROR"
      p e.message
      self.errors.add(:base, e.message) 
    end

  end

  def delete_from_aws  
    begin
      if identity_type == "domain" || identity_type == "email" 
        ses_client.delete_identity(identity: address)
      end
    rescue => e
      self.errors.add(:base, e.message) 
    end
  end

  def dkim_cname_records
    return "" if dkim_tokens.blank?
    tokens = JSON.parse(dkim_tokens)
    dkim = []
    tokens.each do |t|
      dname = t+"._domainkey."+address
      value = t + ".dkim.amazonses.com"
      dkim << {type: "CNAME", name: dname, value: value}
    end
    dkim
  end

  def domain_verification_record 
    if verification_token.present? 
      [{type: "TXT", name: "_amazonses." + address, value: verification_token}]
    end  
  end



  private
  def ses_client
    # AWS::SES::Base.new(
    #   access_key_id: ENV['AWS_ACCESS_KEY_ID'],
    #   secret_access_key: ENV['AWS_SECRET_ACCESS_KEY'],
    #   server: ENV['AWS_EMAIL_SERVER_ZONE']
    # )  
    #ses=Aws::SESV2::Client.new
    ses = Aws::SES::Client.new({
      region: ENV['SES_REGION'],
      credentials: Aws::Credentials.new(ENV['AWS_ACCESS_KEY_ID'], ENV['AWS_SECRET_ACCESS_KEY'])
    }) 

  end



end
