# -*- mode: ruby -*-
# vi: set ft=ruby :

Vagrant.configure("2") do |config|
  
  config.vm.box = "http://files.vagrantup.com/precise32.box"
  config.vm.provision :shell, :path => "setup-dev.sh"

  config.vm.network :"private_network", ip: "192.168.2.2"
  config.vm.network :"forwarded_port", host: 808, guest: 80,
    auto_correct: true

  # config.vm.synced_folder "support", "/support"
end