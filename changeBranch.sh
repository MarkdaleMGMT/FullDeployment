#First argument is repo to be changed
#Second argument is the branch to change to
repo=$1
branch=$2

#Stash any changes in the repo and checkout the new branch
cd $repo
git stash --include-untracked #New files will be stashed alo
git pull #Check for new files
git checkout $branch
git prune #Prune changed files
git pull
echo "\n"
echo "Your Branch Is:"
git branch
