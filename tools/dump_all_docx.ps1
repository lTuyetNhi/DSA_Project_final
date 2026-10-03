Add-Type -AssemblyName System.IO.Compression.FileSystem

function Dump-Docx($docxPath, $outPath) {
    try {
        $zip = [System.IO.Compression.ZipFile]::OpenRead($docxPath)
        $entry = $zip.GetEntry("word/document.xml")
        if ($entry -eq $null) { return }
        $stream = $entry.Open()
        $reader = New-Object System.IO.StreamReader($stream, [System.Text.Encoding]::UTF8)
        $xmlContent = $reader.ReadToEnd()
        $reader.Close()
        $stream.Close()
        $zip.Dispose()
        
        $text = $xmlContent -replace '<w:p[ >]', "`n" -replace '<[^>]+>', ''
        $text = [System.Net.WebUtility]::HtmlDecode($text)
        [System.IO.File]::WriteAllText($outPath, $text, [System.Text.Encoding]::UTF8)
    }
    catch {
        Write-Host "Error $docxPath : $_"
    }
}

New-Item -ItemType Directory -Force -Path "doc_extracted" | Out-Null
Get-ChildItem doc\*.docx | ForEach-Object {
    $out = "doc_extracted\" + $_.BaseName + ".txt"
    Dump-Docx $_.FullName $out
    Write-Host "Extracted $($_.Name) to $out"
}
