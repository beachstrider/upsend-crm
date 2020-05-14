# frozen_string_literal: true

class Agents::RegistrationsController < Devise::RegistrationsController
  before_action :clear_session, only: [:create]

  def create
    name = [sign_up_params[:first_name], sign_up_params[:last_name]].reject { |e| e.to_s.empty? }.join(' ')
    resource_params = sign_up_params.merge(name: name)

    build_resource(sign_up_params)

    resource.save
    yield resource if block_given?
    if resource.persisted?
      sign_in(resource_name, resource, {store: true})

      if !session[:return_to].blank?
        redirect_to session[:return_to]
        session[:return_to] = nil
      else
        a = Doorkeeper::Application.first
        client = OAuth2::Client.new(a.uid, a.secret, site: a.redirect_uri)

        access_token =  client.password.get_token(
          params[:agent][:email], 
          params[:agent][:password]
        )

        respond_with_navigational(resource, status: :success) do
          render json: access_token
        end
      end
    else
      error_messages = resource.errors.full_messages.join("\n")
      render json: { error: error_messages }, status: 422 and return
    end
  end

  private

  def clear_session
    request.env['warden'].logout
  end
end
