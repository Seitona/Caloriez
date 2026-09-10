Add-Type -AssemblyName System.Drawing

$srcPath = "C:\Users\johnj\.gemini\antigravity-ide\brain\a9834ac2-3c17-4bf1-a92a-15fed18c8a0e\caloriez_mascot_icon_1789026098219.jpg"
$img = [System.Drawing.Image]::FromFile($srcPath)

function Resize-And-Save($targetPath, [int]$w, [int]$h) {
    $bmp = New-Object System.Drawing.Bitmap $w, $h
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $g.DrawImage($img, 0, 0, $w, $h)
    
    if (Test-Path $targetPath) {
        Remove-Item -Force $targetPath
    }
    $bmp.Save($targetPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $g.Dispose()
    $bmp.Dispose()
    Write-Host "Created: $targetPath ($w x $h)"
}

Resize-And-Save "assets/images/icon.png" 1024 1024
Resize-And-Save "assets/images/android-icon-foreground.png" 1024 1024
Resize-And-Save "assets/images/splash-icon.png" 512 512
Resize-And-Save "assets/images/favicon.png" 64 64
Resize-And-Save "assets/images/caloriez-mascot.png" 512 512

$img.Dispose()
Write-Host "All Caloriez mascot icons successfully generated!"
