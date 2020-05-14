module Types
  class SesIdentityType < Types::BaseObject 
    field :id, ID, null: false
    field :address, String, null: false
    field :status, String, null: false
    field :identity_type, String, null: false
    field :agent_id, ID, null: true 
    field :cname_records, JsonType, null: true
    field :verification_record, JsonType, null: true

    def cname_records
      # `object` references the user instance
      object.dkim_cname_records.present? ? object.dkim_cname_records : nil
    end

    def verification_record
      # `object` references the user instance
      object.domain_verification_record
    end
  end
end
