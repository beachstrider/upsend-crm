module Mutations
  class SesIdentities::CreateSesIdentity < Mutations::BaseMutation

    field :ses_identity, Types::JsonType, null: false
    field :errors, Types::JsonType, null: true
    field :message, Types::JsonType, null: false

    argument :app_key, String, required: true
    argument :address, String, required: true 
    argument :identity_type, String, required: true 


    def resolve(app_key:, address:, identity_type:)
      current_user = context[:current_user]
      @app = current_user.apps.find_by(key: app_key) 
       
      #Initial state of email address is pending.
      #User has to verify the email address sent to him by aws ses
      @ses_identity = current_user.ses_identities.new
      @ses_identity.app_id = @app.id
      @ses_identity.assign_attributes(
        address: address.strip.downcase,  
        status: "pending",
        identity_type: identity_type
      )
      @ses_identity.add_to_aws_ses 
      @ses_identity.save 
      
       
      { ses_identity: @ses_identity, errors: @ses_identity.errors }

    end
  end
end
