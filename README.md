# Substack Backup

Automate backing up JSON copies of your [Substack](https://substack.com) subscriber list, using GitHub Actions and AWS S3.

Backups will be generated using Puppeteer and saved into the `backups` folder (`config.backupFolder`, can be changed) of an S3 bucket of your choice.

_NOTE: You must have a Substack password to use this tool –– if you've been using the email login so far, just use the reset password tool to create a password. You can still use the email login, and have this backup tool use your password._

## Usage

You can get `substack-backup` up and running in just a few minutes! The best part is that **you don't need to deploy anything!** 

Just follow these steps and you'll be on your way:

#### 1. Fork this repository

If you haven't done this before, you'll find the Fork button on the top right of a GitHub repository's screen.

#### 2. Enable Actions on your newly forked repository

This is necessary because Actions get disabled when you fork a repository. Do this by tapping on the "Actions" tab in your repository (next to "Pull Requests"), and hit the big green button.

#### 3. Setup an AWS S3 bucket to store your Roam backups

- Ensure you create the AWS S3 bucket manually –– this script will not create the bucket. Note the `awsBucketName` for step #4.
- Create (or find an existing) user in the AWS console, and note its `awsAccessKeyId` and `awsAccessKeySecret` for step #4.
- Ensure the user has permissions to upload to an S3 bucket. To do this, you'll need to attach a policy to the user that allows uploading to S3. The simplest way to do this would be to use the existing global policy: `AmazonS3FullAccess`.
- _(OPTIONAL)_ If you want to be a bit more conservative with the access policy, instead of `AmazonS3FullAccess` you can create your own custom policy and attach that to the user. Here's an example of the attributes you'd need to set:
  - Service: S3
  - Access Level: Write -> Put Object (NOTE: Do not simply select 'Write', instead click on the arrow to drill down into it and choose only 'Put Bucket' within all the options under Write)
  - Resource: Click on "Add ARN", and specify the Bucket Name, you can select "Any" for Object Name
  - Review and save the policy, then attach it to your user
- Note the `awsAccessKeyId` and `awsAccessKeySecret` of the user for step #4.

#### 4. Set your repository Secrets

Go to your Github repository's Settings tab, and click on Secrets section on the left. Add the following secrets (**naming must match exactly!**), using your Roam login credentials and the AWS bucket name and user access key ID/secret from step #3:

- `substackUrl` (e.g. [https://brownfox.substack.com](https://brownfox.substack.com))
- `substackEmail`
- `substackPassword`
- `awsBucketName`
- `awsAccessKeyId`
- `awsAccessKeySecret`

_Don't worry! Your Substack and AWS credentials will be secure. GitHub [Secrets](https://help.github.com/en/actions/configuring-and-managing-workflows/creating-and-storing-encrypted-secrets) are encrypted, and provide a convenient methodology for storing secure data in repositories._

#### 5. Make a commit. It can be any commit, but this will start the process and trigger workflows.

Congrats! 🎉 You've successfully automated the backup of your Substack subscriber list. Now go write a post about it!

_NOTE: I built this tool following @signalnerve's roam-backup as an example, and this is was his project using Puppeteer, so it may be a little buggy..._

## Development

Running this project locally should be possible using `.env` - copy `.env.example` to `.env` and fill it in with your own authentication keys. 

The project generates an `error.png` screenshot to capture the current page if something goes wrong, as well as ZIP folders, which are the JSON backups. Running `npm start` will clear any local screenshots and backups, and run the script as it would in the GitHub Actions workflow (`npm start`)
