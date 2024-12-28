git sw develop
git push
git sw main
git reset HEAD --hard
git merge develop --no-ff
npm version minor
git push
git sw develop
git rebase main