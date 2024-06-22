param (
    [string]$text = "abandon",
    [string]$voiceName = "Microsoft David Desktop"
)

Add-Type -AssemblyName System.Speech
$synthesizer = New-Object -TypeName System.Speech.Synthesis.SpeechSynthesizer

$synthesizer.GetInstalledVoices() | ForEach-Object {
    $_.VoiceInfo.Name
}

if ($voiceName) {
    $voice = $synthesizer.GetInstalledVoices() | Where-Object {
        $_.VoiceInfo.Name -eq $voiceName
    }
    if ($voice) {
        $synthesizer.SelectVoice($voiceName)
    }
    else {
        Write-Output "Voice '$voiceName' not found. Using default voice."
    }
}

$synthesizer.Speak($text)
