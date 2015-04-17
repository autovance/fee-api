sudo apt-get update

sudo apt-get -y install software-properties-common python-software-properties
sudo add-apt-repository -y ppa:git-core/ppa
sudo apt-get -y install build-essential
sudo apt-get update

sudo apt-get -y install git
sudo apt-get -y install vim
sudo apt-get -y install curl


wget -qO- https://toolbelt.heroku.com/install-ubuntu.sh | sh

git config --global credential.helper 'cache --timeout=28800'
git config --global push.default simple


# curl https://raw.githubusercontent.com/creationix/nvm/v0.24.1/install.sh | bash
