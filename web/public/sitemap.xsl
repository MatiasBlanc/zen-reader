<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="2.0" 
                xmlns:html="http://www.w3.org/TR/REC-html40"
                xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
                xmlns:sitemap="http://www.sitemaps.org/schemas/sitemap/0.9"
                xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:output method="html" version="1.0" encoding="UTF-8" indent="yes"/>
  <xsl:template match="/">
    <html xmlns="http://www.w3.org/1999/xhtml" lang="en">
      <head>
        <title>XML Sitemap — Zen Reader</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <style type="text/css">
          :root {
            --bg: #F9F7F2;
            --surface: #FFFFFF;
            --border: #E5DFC8;
            --text: #1C1917;
            --text-muted: #655E53;
            --accent: #954D28;
            --accent-light: #F6EBE5;
          }
          * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
          }
          body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            background-color: var(--bg);
            color: var(--text);
            padding: 40px 20px;
            line-height: 1.5;
          }
          .container {
            max-width: 900px;
            margin: 0 auto;
          }
          .header {
            margin-bottom: 30px;
            padding-bottom: 20px;
            border-bottom: 1px solid var(--border);
          }
          h1 {
            font-size: 28px;
            font-weight: 700;
            color: var(--accent);
            margin-bottom: 8px;
          }
          p.desc {
            color: var(--text-muted);
            font-size: 14px;
          }
          .stats {
            margin-top: 15px;
            display: inline-flex;
            gap: 12px;
            font-size: 12px;
            background: var(--surface);
            padding: 8px 16px;
            border-radius: 999px;
            border: 1px solid var(--border);
            font-weight: 600;
          }
          .table-wrap {
            background: var(--surface);
            border: 1px solid var(--border);
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 4px 20px -2px rgba(45, 35, 20, 0.05);
          }
          table {
            width: 100%;
            border-collapse: collapse;
            text-align: left;
            font-size: 13px;
          }
          th {
            background: var(--bg);
            padding: 12px 16px;
            font-weight: 600;
            color: var(--text);
            border-bottom: 1px solid var(--border);
          }
          td {
            padding: 14px 16px;
            border-bottom: 1px solid var(--border);
          }
          tr:last-child td {
            border-bottom: none;
          }
          tr:hover td {
            background-color: var(--accent-light);
          }
          a {
            color: var(--accent);
            text-decoration: none;
            font-weight: 500;
          }
          a:hover {
            text-decoration: underline;
          }
          .badge {
            display: inline-block;
            padding: 2px 8px;
            border-radius: 6px;
            font-size: 11px;
            font-weight: 600;
            background: var(--bg);
            border: 1px solid var(--border);
            color: var(--text-muted);
          }
          .priority {
            font-weight: 600;
            color: var(--accent);
          }
          .footer {
            margin-top: 30px;
            text-align: center;
            font-size: 12px;
            color: var(--text-muted);
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>XML Sitemap — Zen Reader</h1>
            <p class="desc">This is the Google-compliant XML Sitemap for <strong>zen-reader.madeinchile.tech</strong>. It informs search engines about all available URLs and indexing priorities.</p>
            <div class="stats">
              <span>Total URLs: <xsl:value-of select="count(sitemap:urlset/sitemap:url)"/></span>
            </div>
          </div>

          <div class="table-wrap">
            <table>
              <thead>
                <tr>
                  <th style="width: 50%;">URL</th>
                  <th style="width: 15%;">Priority</th>
                  <th style="width: 15%;">Change Frequency</th>
                  <th style="width: 20%;">Last Modified</th>
                </tr>
              </thead>
              <tbody>
                <xsl:for-each select="sitemap:urlset/sitemap:url">
                  <tr>
                    <td>
                      <a href="{sitemap:loc}">
                        <xsl:value-of select="sitemap:loc"/>
                      </a>
                    </td>
                    <td>
                      <span class="priority"><xsl:value-of select="sitemap:priority"/></span>
                    </td>
                    <td>
                      <span class="badge"><xsl:value-of select="sitemap:changefreq"/></span>
                    </td>
                    <td>
                      <span class="badge"><xsl:value-of select="sitemap:lastmod"/></span>
                    </td>
                  </tr>
                </xsl:for-each>
              </tbody>
            </table>
          </div>

          <div class="footer">
            <p>Generated for <a href="https://zen-reader.madeinchile.tech/">Zen Reader</a> • Crafted by <a href="https://madeinchile.tech">Made in Chile</a></p>
          </div>
        </div>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
