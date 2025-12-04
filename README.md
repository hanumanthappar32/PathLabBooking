
# How to Publish Your App

You are currently running this app in a **Cloud Environment**. To publish it to the web (Hostinger) or create a Mobile App (Play Store), follow these steps.

## 1. Build and Download
To get the files out of this editor and onto your computer:

1.  Open the **Terminal** (at the bottom of the screen).
2.  Run this command:
    ```bash
    npm install && npm run build && zip -r my-app.zip dist
    ```
3.  Look in the **File Explorer** on the left.
4.  Right-click **`my-app.zip`** and select **Download**.

## 2. Publish to Hostinger (Web)
1.  Log in to your Hostinger hPanel.
2.  Go to **File Manager** -> **public_html**.
3.  Upload **`my-app.zip`**.
4.  Right-click the zip file and select **Extract**.
5.  Move the files out of the `dist` folder if necessary, so they sit directly inside `public_html`.
6.  Your site is now live!

## 3. Publish to Play Store (Mobile)
1.  Go to **[PWABuilder.com](https://www.pwabuilder.com/)**.
2.  Enter your website URL (e.g., `https://rameshh.com`).
3.  Click **Package for Stores** -> **Android**.
4.  Download the **.aab** file.
5.  Upload this file to your **Google Play Console**.

## Support
If you need to change the lab address, edit `components/ReportView.tsx` and `App.tsx`.
