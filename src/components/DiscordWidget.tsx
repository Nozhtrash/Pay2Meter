
"use client";

export function DiscordWidget() {
  return (
    <div className="rounded-lg overflow-hidden shadow-lg my-6">
      <iframe
        src="https://discord.com/widget?id=829913310948950016&theme=dark"
        width="100%"
        height="500"
        allowTransparency={true}
        sandbox="allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts"
        className="bg-transparent"
      ></iframe>
    </div>
  );
}
