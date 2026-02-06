<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:output method="html" encoding="UTF-8" indent="yes"/>
  <xsl:template match="/">
    <html>
      <head>
        <title>FoRML Blog RSS</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 2rem; color: #1f2937; background: #f9fafb; }
          h1 { margin-bottom: 0.25rem; }
          .meta { color: #6b7280; margin-bottom: 1.5rem; }
          .item { padding: 0.75rem 0; border-bottom: 1px solid #e5e7eb; }
          .item a { color: #2563eb; text-decoration: none; font-weight: 600; }
          .item a:hover { text-decoration: underline; }
          .date { color: #6b7280; font-size: 0.9rem; }
          .hint { margin-top: 1.5rem; font-size: 0.95rem; color: #374151; }
          code { background: #eef2ff; padding: 0.1rem 0.3rem; border-radius: 4px; }
        </style>
      </head>
      <body>
        <h1><xsl:value-of select="rss/channel/title"/></h1>
        <div class="meta">
          <xsl:value-of select="rss/channel/description"/>
        </div>
        <xsl:for-each select="rss/channel/item">
          <div class="item">
            <a href="{link}"><xsl:value-of select="title"/></a>
            <div class="date"><xsl:value-of select="pubDate"/></div>
          </div>
        </xsl:for-each>
        <div class="hint">
          This is an RSS feed. Subscribe by copying this URL into your reader:
          <code><xsl:value-of select="rss/channel/link"/>rss.xml</code>
        </div>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
