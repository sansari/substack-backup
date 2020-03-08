# 📩 Substack Backup

Automate backing up CSV exports of your [Substack](https://substack.com) subscriber list, using GitHub Actions and AWS S3.

## Requirements

- **You need your Substack URL, email and password.** If you've been using the email login for your Substack so far, just use the reset password tool to create a password. You can still use the email login, and have this backup tool use your password.
- **You need a GitHub account** in order to fork this repository.
- **You need an [Amazon AWS account](https://aws.amazon.com/console/)** in order to create an S3 bucket to store your export files.

## Usage

You can get `substack-backup` up and running in just a few minutes! The best part is that **you don't need to deploy anything!** Backups will be generated using Puppeteer and saved into the `backups` folder (`config.backupFolder`, can be changed) of an S3 bucket of your choice. The backups will be automatically triggered by GitHub Actions on a regular interval (by default, every 15 minutes, but can be changed). Set it, and forget it!

Just follow these steps and you'll be on your way:

#### 1. Fork this GitHub repository

If you haven't done this before, you'll find the Fork button on the top right of a GitHub repository's screen.

#### 2. Enable Actions on your newly forked GitHub repository

This is necessary because Actions get disabled when you fork a repository. Do this by tapping on the "Actions" tab in your repository (next to "Pull Requests"), and hit the big green button.

#### 3. Create an AWS S3 bucket

- Ensure you create the AWS S3 bucket manually –– this script will not create the bucket. Note the `awsBucketName` for step #4.
- Create (or find an existing) user in the AWS console, and note its `awsAccessKeyId` and `awsAccessKeySecret` for step #4.
- Ensure the user has permissions to upload to an S3 bucket. To do this, you'll need to attach a policy to the user that allows uploading to S3. The simplest way to do this would be to use the existing global policy: `AmazonS3FullAccess`.
- _(OPTIONAL)_ If you want to be a bit more conservative with the access policy, instead of `AmazonS3FullAccess` you can create your own custom policy and attach that to the user. Here are the policy values you'll need to set:
  - **Service**: S3
  - **Access Level**: Write -> Put Object (NOTE: Do not simply select 'Write', instead click on the arrow to drill down into it and choose only 'Put Bucket' within all the options under Write)
  - **Resource**: Click on "Add ARN", and specify the Bucket Name you created earlier. You can select "Any" for Object Name
  - Review and Save the policy, then attach it to your user


#### 4. Set your GitHub repository Secrets

Go to your Github repository's Settings tab, and click on Secrets section on the left. Add the following secrets (**naming must match exactly!**), using your Roam login credentials and the AWS bucket name and user access key ID/secret from step #3:

- `substackUrl` (e.g. [https://brownfox.substack.com](https://brownfox.substack.com))
- `substackEmail`
- `substackPassword`
- `awsBucketName`
- `awsAccessKeyId`
- `awsAccessKeySecret`

_Don't worry! Your Substack and AWS credentials will be secure. GitHub [Secrets](https://help.github.com/en/actions/configuring-and-managing-workflows/creating-and-storing-encrypted-secrets) are encrypted, and provide a convenient methodology for storing secure data in repositories._

#### 5. Push a commit.

You'll need to push a commit to master after forking to initiate the process and trigger the GitHub Actions workflows. The simplest way to do this would be to tap on the pencil icon next to the `README.md` file, make a change, and submit the commit.

Once you do so, you should be able to visit the Actions tab and see your first workflow in action. You can then visit the AWS Console and take a peek at your S3 bucket. You should see the newly created `backups` folder, with the first automatically exported file. From this point on, these exports will happen automatically!

#### 6. Profit

Congrats! 🎉 You've successfully automated the backup of your Substack subscriber list. Now go write a post about it!

## Development

Running this project locally should be possible using `.env` - copy `.env.example` to `.env` and fill it in with your own authentication keys. 

The project generates an `error.png` screenshot to capture the current page if something goes wrong, as well as ZIP folders, which are the JSON backups. Running `npm start` will clear any local screenshots and backups, and run the script as it would in the GitHub Actions workflow (`npm start`)

## Disclaimer

This is not an official export tool, nor is it associated with Substack Inc. in any way. It's just a little hack I put together to automate subscriber exports for my newsletter, [Quick Brown Fox 🦊](https://brownfox.substack.com).

_Note on Security:_ Your credentials will only be stored in your *own* forked repository, and they will be encrypted using GitHub Secrets. As for Amazon, it can only manipulate the S3 bucket you specify, and you can choose how conservative to make the access policy. There is no server that has access to your credentials or stores any of your data. Still, use it at your own risk, and if you're unsure then I'd just suggest sticking with manual export or whatever solution you're currently using.

If you do end up using the tool, and find it useful, hit me up on Twitter [@daretorant](https://twitter.com/daretorant) and let me know. Happy exporting!

## Contributing

If you notice any issues, or discover a better way to access exports, feel free to put up a PR. Thank you in advance for helping to keep the tool working well!

## Credits

Big thanks to @signalnerve who built a tool to export Roam backups ([roam-backup]()). I based this Substack export tool directly off of the approach he took, with some modifications.
