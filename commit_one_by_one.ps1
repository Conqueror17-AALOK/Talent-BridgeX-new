$files = git status --short | ForEach-Object { $_.Substring(3) }
foreach ($file in $files) {
    if ($file -ne "") {
        Write-Host "Committing $file..."
        git add "$file"
        git commit -m "chore: update $file"
    }
}
Write-Host "Pushing to GitHub..."
git push
