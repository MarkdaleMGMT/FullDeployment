repo=$1
branch=$2

cd $repo
git stash
git checkout $branch
git pull
