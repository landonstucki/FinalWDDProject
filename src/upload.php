<?php require_once 'auth-check.php'; ?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Upload Photos</title>
  <script src="https://upload-widget.cloudinary.com/latest/global/all.js"></script>
  <style>
    body {
      font-family: Arial, sans-serif;
      background: #f5f5f5;
      margin: 0;
      padding: 2rem;
    }

    .wrap {
      max-width: 700px;
      margin: 0 auto;
      background: white;
      padding: 2rem;
      border-radius: 18px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.08);
    }

    h1 {
      margin-top: 0;
    }

    label {
      display: block;
      font-weight: 600;
      margin-bottom: 0.5rem;
    }

    input {
      width: 100%;
      box-sizing: border-box;
      padding: 0.9rem 1rem;
      border: 1px solid #ccc;
      border-radius: 10px;
      margin-bottom: 1rem;
      font-size: 1rem;
    }

    button,
    a {
      display: inline-block;
      padding: 0.9rem 1.1rem;
      border-radius: 10px;
      border: 0;
      background: #111;
      color: white;
      text-decoration: none;
      cursor: pointer;
      font-size: 1rem;
      margin-right: 0.75rem;
      margin-top: 0.5rem;
    }

    .secondary {
      background: #666;
    }

    #status {
      margin-top: 1.25rem;
      color: #1a7f37;
      font-weight: 600;
    }

    .help {
      color: #666;
      margin-top: 0.75rem;
      line-height: 1.5;
    }
  </style>
</head>
<body>
  <div class="wrap">
    <h1>Stucki Homes Photos Client</h1>
    <h2>Upload Project Photos</h2>
    <p>Logged in as <?php echo htmlspecialchars($_SESSION['username']); ?></p>

    <label for="albumTag">Album Name</label>
    <input
      id="albumTag"
      type="text"
      placeholder="Example: Smith Home"
      maxlength="80"
    >

    <button id="upload_widget">Upload Photos</button>
    <a class="secondary" href="logout.php">Log Out</a>
    <a class="secondary" href="pages/gallery.html">View Gallery</a>

    <p class="help">
      Enter an album name. A new album button will appear automatically on the gallery page after photos are uploaded.
    </p>

    <div id="status"></div>
  </div>

  <script>
    const cloudName = "Removed";
    const apiKey = "Removed";
    const uploadPreset = "Removed";

    function slugify(value) {
      return value
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");
    }

    document.getElementById("upload_widget").addEventListener("click", function () {
      const rawAlbum = document.getElementById("albumTag").value;
      const cleanAlbum = slugify(rawAlbum);
      const statusEl = document.getElementById("status");

      if (!cleanAlbum) {
        alert("Please enter an album name.");
        return;
      }

      const albumTag = `album_${cleanAlbum}`;

      const widget = cloudinary.createUploadWidget(
        {
          cloudName,
          apiKey,
          uploadPreset,
          multiple: true,
          resourceType: "image",
          clientAllowedFormats: ["jpg", "jpeg", "png", "webp"],
          sources: ["local", "camera"],

          prepareUploadParams: async (cb, params) => {
            try {
              const response = await fetch("/cloudinary-sign.php", {
                method: "POST",
                headers: {
                  "Content-Type": "application/x-www-form-urlencoded"
                },
                body: new URLSearchParams({
                  folder: "stucki/gallery",
                  tags: albumTag,
                  upload_preset: uploadPreset,
                  source: "uw"
                })
              });

              const data = await response.json();

              if (!response.ok || !data.signature || !data.timestamp) {
                throw new Error(data.error || "Could not create signature");
              }

              cb({
                signature: data.signature,
                timestamp: data.timestamp,
                folder: "stucki/gallery",
                tags: albumTag,
                upload_preset: uploadPreset,
                source: "uw"
              });
            } catch (error) {
              console.error(error);
              alert("Upload signing failed.");
            }
          }
        },
        (error, result) => {
          if (error) {
            console.error(error);
            return;
          }

          if (result && result.event === "success") {
            statusEl.textContent = `Uploaded to album: ${cleanAlbum}`;
            console.log("Uploaded:", result.info);
          }
        }
      );

      widget.open();
    });
  </script>
</body>
</html>