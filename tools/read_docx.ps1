Add-Type -AssemblyName System.IO.Compression.FileSystem

function Get-DocxText($docxPath) {
    try {
        $zip = [System.IO.Compression.ZipFile]::OpenRead($docxPath)
        $entry = $zip.GetEntry("word/document.xml")
        if ($entry -eq $null) { return "" }
        $stream = $entry.Open()
        $reader = New-Object System.IO.StreamReader($stream, [System.Text.Encoding]::UTF8)
        $xmlContent = $reader.ReadToEnd()
        $reader.Close()
        $stream.Close()
        $zip.Dispose()
        
        $text = $xmlContent -replace '<w:p[ >]', "`n" -replace '<[^>]+>', ''
        $text = [System.Net.WebUtility]::HtmlDecode($text)
        return $text
    }
    catch {
        return "Error reading $docxPath : $_"
    }
}

[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

Get-ChildItem doc\*.docx | ForEach-Object {
    Write-Output "========================================"
    Write-Output "FILE: $($_.Name)"
    Write-Output "========================================"
    $txt = Get-DocxText $_.FullName
    Write-Output $txt
}
