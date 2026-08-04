flowchart LR

subgraph 0["src"]
subgraph 1["application"]
subgraph 2["messaging"]
3["message-types.ts"]
end
subgraph 4["ports"]
5["article-repository.port.ts"]
6["notifier.port.ts"]
7["sound-player.port.ts"]
end
subgraph 8["use-cases"]
9["clip-article.use-case.ts"]
D["delete-article.use-case.ts"]
E["get-library.use-case.ts"]
H["mark-as-read.use-case.ts"]
I["update-preferences.use-case.ts"]
end
end
subgraph A["domain"]
subgraph B["errors"]
C["article-errors.ts"]
end
subgraph F["services"]
G["text-sanitizer.ts"]
V["reading-calculator.ts"]
end
subgraph S["entities"]
T["article.ts"]
U["preferences.ts"]
end
end
subgraph J["background"]
K["service-worker.ts"]
end
subgraph L["infrastructure"]
subgraph M["di"]
N["container.ts"]
end
subgraph O["persistence"]
P["dexie-article.repository.ts"]
end
subgraph Q["sound"]
R["cuelume-sound-player.ts"]
end
subgraph W["notifications"]
X["chrome-toast.notifier.ts"]
Y["popup-toast.notifier.ts"]
end
subgraph Z["parser"]
10["readability.parser.ts"]
end
end
subgraph 11["presentation"]
subgraph 12["clipper"]
13["ToastNotification.tsx"]
15["content-script.tsx"]
16["toast-types.ts"]
end
14["icons.ts"]
subgraph 17["dashboard"]
18["DashboardApp.tsx"]
subgraph 19["components"]
1A["ReaderView.tsx"]
1C["ThemeToggle.tsx"]
1D["Sidebar.tsx"]
end
1B["store.ts"]
subgraph 1E["hooks"]
1F["useArticles.ts"]
end
1G["main.tsx"]
end
subgraph 1I["popup"]
1J["PopupApp.tsx"]
1K["main.tsx"]
end
end
1H["index.css"]
end
9-->C
D-->C
E-->G
H-->C
K-->N
N-->9
N-->D
N-->E
N-->H
N-->I
N-->P
N-->R
13-->14
15-->13
15-->G
15-->10
18-->14
18-->1A
18-->1D
18-->1F
18-->1B
1A-->14
1A-->1B
1A-->1C
1B-->I
1B-->N
1B-->X
1C-->1B
1D-->14
1D-->1B
1F-->1B
1G-->1H
1G-->18
1J-->14
1J-->N
1K-->1H
1K-->1J
