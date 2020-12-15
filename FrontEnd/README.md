同学们如果clone了repo到本地发现compile不了，记得在src folder里加一个file叫constants.js.然后申请一个google maps api key，免费的就可以了。在constants.js 里写上：

export const GOOGLE_KEY = "你的api key";

export const GOOGLE_PLACES_URL = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_KEY}&libraries=places`;




set up exercise

两个公用账号的 repo 由组长 access 用户名和密码。

本次 Project 使用的合作模式是 collaborator 模式。

collaborator 模式：每个合作者新建自己部分的 feature branch，在这个新分支上进行代码修改，然后提起向 master branch 的 pull request
collaborator 模式适合用于一个小型的、信任度较高的团队中，因为此时几个合作者都拥有了最高“写”权限。这种模式下，可以把这几个合作者看成一个人在工作，遵从 git flow 的方式，从而以创建不同 branch 的方式进行合作开发。
Scenerio

组长在收集到组员们的 GitHub username 后会进行 Collaborators 添加，邀请组员们为合作者。组员们在收到邀请提醒后，可选择接受邀请。组员们此时拥有了组长所创建项目的直接读写权利。
组员们访问到公共账号的项目仓库后，可将其项目克隆到自己的本机上，然后在本机上进行开发。开发时，为了便于代码审查以及防止冲突，应另开分支再开发。比如新建自己部分的 feature branch，在这个分支下开发好后，可直接 push 到远端，注意此时会直接推送到公共账号的项目仓库下，因为组员们作为合作者拥有公共账号的创建的项目的直接“写”权力。
组员们此时查看公共账号的的项目主页，会提醒你最近 push 了一个 branch 到该仓库下，你可以选择 Compare & pull request，从而试图将你在新分支下所作的代码修改 merge 到该项目的 master 分支上去。
如果一切顺利的话，点击 Compare & pull request 之后会提示 “This branch has no conflicts with the base branch”. 说明新分支可以被顺利融合到主分支上去。
由于组员们本身就是项目合作者，所以拥有权力决定是否批准该 pull request。但是恳请各位组员请勿在未经 code review 的情况下 Merge pull request.
Exercise

请每个人通过使用以下 command lines 完成以下练习：在 ExpressBotFrontend/src/index.js 里添加自己的名字。

git clone https://github.com/flagcampteam5/ExpressBotFrontend.git
On team projects, we use repositories whose main version is stored on a remote server. Then, each developer on the team will have their own local branch of the code.

git fetch will tell local git to retrieve the latest (yet doesn't do any file transferring. just checking to see if there are any changes available)

Notice: git pull on the other hand does that AND copies those changes from the remote repository

git fetch --all
Now all changes made to the remote repository — including changes made to every branch — are included in your local version of the repo. Then, you can check out the remote branch on your local machine because your local machine gathered a copy of all the remote branches.

Notice: -b means creating a new branch

git checkout -b [your branch name]
After you edit ExpressBotFrontend/src/index.js by appending your name in a <p>[your name]</p> on the webpage, remember to add, commit and push.
If you run npm start, you should be able to see your name and the names of the other team members who have already made changes on your browser at localhost/300.

git add
git commit -m "[your message]"
git push origin
if you see a warning as

fatal: The current branch [your branch name] has no upstream branch.
To push the current branch and set the remote as upstream, use 
git push --set-upstream origin [your branch name]
follow it and run git push --set-upstream origin [your branch name].

After that you will see a successful message as

remote: Create a pull request for '[your branch name]' on GitHub by visiting:
remote:      https://github.com/flagcampteam5/ExpressFrontend/pull/new/[your branch name]
Then you are done! We will handle the pull request.
