const Canvas = require("canvas");
const axios = require("axios");
const path = require("path");

Canvas.registerFont(path.join(__dirname, "../../Teuton.otf"), {
  family: "TeutonNormal",
});

module.exports = function (app) {

  app.get("/maker/fakeffduo3", async (req, res) => {

    const name1 = req.query.name1?.trim();
    const name2 = req.query.name2?.trim();
    const bg = parseInt(req.query.bg || "1");

    if (!name1 || !name2) {
      return res.status(400).json({
        status: false,
        message: "parameter name1 dan name2 diperlukan",
      });
    }

    const githubBaseUrl = "https://raw.githubusercontent.com/Andre-Learn/Maker/refs/heads/main";
    const max = 50;

    if (bg < 1 || bg > max) {
      return res.status(400).json({
        status: false,
        message: `background harus 1-${max}`,
      });
    }

    try {

      const bgUrl = `${githubBaseUrl}/FF%20DUO/${bg}.png`;
      const bgBuffer = (await axios.get(bgUrl, { responseType: "arraybuffer" })).data;

      const background = await Canvas.loadImage(bgBuffer);

      const canvas = Canvas.createCanvas(background.width, background.height);
      const ctx = canvas.getContext("2d");

      ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

      ctx.font = `bold 50px "TeutonNormal"`;
      ctx.textAlign = "center";

      ctx.fillStyle = "#ffffff";
      ctx.fillText(name1, 228, canvas.height - 379);

      ctx.fillStyle = "#ffb300";
      ctx.fillText(name1, 228, canvas.height - 379);

      ctx.strokeStyle = "rgba(0,0,0,0.8)";
      ctx.lineWidth = 1.6;
      ctx.strokeText(name1, 228, canvas.height - 379);

      ctx.fillStyle = "#ffffff";
      ctx.fillText(name2, 890, canvas.height - 517);

      ctx.fillStyle = "#ffb300";
      ctx.fillText(name2, 890, canvas.height - 517);

      ctx.strokeStyle = "rgba(0,0,0,0.8)";
      ctx.lineWidth = 1.6;
      ctx.strokeText(name2, 890, canvas.height - 517);

      const buffer = canvas.toBuffer("image/png");

      res.writeHead(200, {
        "Content-Type": "image/png",
        "Content-Length": buffer.length,
      });

      res.end(buffer);

    } catch (err) {
      res.status(500).json({
        status: false,
        message: err.message || "gagal membuat gambar",
      });
    }

  });

};