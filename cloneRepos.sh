backend=$1 #Backend branch
frontendserver=$2 #frontend server branch
frontendapp=$3 #frontendapp branch

git clone --branch "$backend" https://github.com/MarkdaleMGMT/transaction-methods.git
git clone --branch "$frontendserver" https://github.com/MarkdaleMGMT/frontend-server.git
git clone --branch "$frontendapp" https://github.com/MarkdaleMGMT/frontend-app.git
