namespace :report_usage_stripe do
  desc "Report Additional usage charges"
  task :execute => :environment do 
    App.report_add_on_usage_to_stripe
  end
end