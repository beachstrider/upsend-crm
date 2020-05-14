# frozen_string_literal: true

module Types
  class UserType < Types::BaseObject
    field :email, String, null: true
    field :avatar_url, String, null: true
    field :name, String, null: true
  end
end
