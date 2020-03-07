require("dotenv").config();

const config = {
  backupFolder: "backups"
};

const AWS = require("aws-sdk");
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_ACCESS_KEY_SECRET
});

const fs = require("fs");
const glob = require("glob");
const puppeteer = require("puppeteer");

const generateExport = async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  try {
    await page._client.send("Page.setDownloadBehavior", {
      behavior: "allow",
      downloadPath: process.cwd()
    });

    await page.goto(process.env.SUBSTACK_URL);

    console.log("Logging into Substack");

    await page.$eval(".login-button", el => el.click());

    await page.waitFor(3000);

    await page.$eval(".login-option a", el => el.click());

    await page.focus('[name="email"]');
    await page.keyboard.type(process.env.SUBSTACK_EMAIL);

    await page.focus('[name="password"]');
    await page.keyboard.type(process.env.SUBSTACK_PASSWORD);

    await page.$eval("[type='submit']", el => el.click());

    console.log("Successfully logged in");

    await page.waitFor(3000);

    await page.$eval("#subscribers", el => el.click());

    await page.waitFor(3000);

    await page.$eval(".stat-export.button", el => el.click());

    console.log("Download initiated");

    await page.waitFor(3000);

    await page.screenshot({ path: "downloading.png" });

    console.log("Waiting five seconds for it to download");

    await page.waitFor(5000);
  } catch (err) {
    console.error("Something went wrong!");
    console.error(err);

    await page.screenshot({ path: "error.png" });
  }
  await browser.close();
};

const uploadToS3 = async filename => {
  try {
    const fileContent = fs.readFileSync(filename);

    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: `${config.backupFolder}/${filename}`,
      Body: fileContent
    };

    const data = await s3.upload(params).promise();
    console.log(`Successfully backed up Substack data to S3: ${data.Location}`);
  } catch (err) {
    console.error("Something went wrong while uploading to S3");
    console.error(err);
  }
};

const main = async function() {
  await generateExport();
  const files = glob.sync("*.csv");
  const filename = files[0];
  if (!filename) {
    throw new Error("Couldn't find a file to upload, aborting");
  }
  console.log(`Uploading ${filename} to S3`);
  await uploadToS3(filename);
};

main();
