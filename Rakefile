# Bring in Rocco tasks
require 'rocco/tasks'
Rocco::make 'docs/', 'lib/**/*.js', :language => 'js'

desc 'Build documentation'
task :docs => :rocco
directory 'docs/'

require 'rake/clean'
CLEAN.include 'docs'

namespace :website do
  file 'index.html' => 'docs/lib/flapjack.html' do |task|
    cp task.prerequisites.first, task.name
  end

  task :build => 'index.html'
end
