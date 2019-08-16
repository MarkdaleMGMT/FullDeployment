repo=$1
branch=$2

cd $repo
git stash --include-untracked
git checkout $branch
git prune
git pull
