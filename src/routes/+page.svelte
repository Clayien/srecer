<script lang="ts">
	import {
		DownloadIcon,
		IconButton,
		MicOffIcon,
		MicOnIcon,
		SettingsIcon,
		ShareIcon,
		ShareOffIcon
	} from '$lib';

	const VIDEO_EXT = 'webm';
	const VIDEO_TYPE = `video/${VIDEO_EXT}`;
	const CODECS = 'codecs=vp9,opus';
	const MIME_TYPE = `${VIDEO_TYPE};${CODECS}`;

	let video: HTMLVideoElement;
	let stream: MediaStream;
	let recorder: MediaRecorder;
	let blobs: Blob[] = [];

	let sharingScreen: boolean = false;
	let showPreview: boolean = true;
	let sharingMic: boolean = false;
	let recording: boolean = false;

	async function shareScreen() {
		try {
			const width = window.screen.width;
			const height = window.screen.height;
			stream = await navigator.mediaDevices.getDisplayMedia({
				video: {
					displaySurface: 'browser',
					// aspectRatio: aspect,
					frameRate: 30,
					width: width,
					height: height
				},
				audio: {
					autoGainControl: false,
					echoCancellation: true,
					noiseSuppression: true,
					sampleRate: 48_000
				}
				// preferCurrentTab: false,
				// selfBrowserSurface: 'exclude',
				// systemAudio: 'include',
				// surfaceSwitching: 'include',
				// monitorTypeSurfaces: 'include'
			});
			sharingScreen = true;
			const userMediaStream = await navigator.mediaDevices.getUserMedia({
				video: false,
				audio: true
			});
			for (const audioTrack of userMediaStream.getAudioTracks()) {
				stream.addTrack(audioTrack);
			}
		} catch (err) {
			console.error(err);
		}
	}

	function handleDownload() {
		const blob = new Blob(blobs, { type: MIME_TYPE });
		const url = window.URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.style.display = 'none';
		a.href = url;
		a.download = `recorded.webm`;
		document.body.appendChild(a);
		a.click();
		setTimeout(() => {
			document.body.removeChild(a);
			window.URL.revokeObjectURL(url);
		}, 100);
		blobs = [];
	}

	let interval: ReturnType<typeof setInterval>;
	let recordingTime: string = '';
	let recordingSeconds: number = 0;
	function handleRecording() {
		recording = !recording;
		if (recording) {
			try {
				recorder = new MediaRecorder(stream, {
					mimeType: MIME_TYPE,
					videoBitsPerSecond: 5000000,
					audioBitsPerSecond: 128000
				});
				recorder.onstop = () => {
					console.log(blobs);
				};
				recorder.ondataavailable = (e) => {
					if (e.data && e.data.size > 0) {
						blobs = [...blobs, e.data];
					}
				};
				recorder.start();
				console.log('Recording started');

				recordingTime = '00:00:00';
				interval = setInterval(() => {
					recordingSeconds += 1;
					if (recordingSeconds > 0) {
						const hours = Math.floor(recordingSeconds / 3600)
							.toString()
							.padStart(2, '0');
						const remainingSeconds = recordingSeconds % 3600;
						const minutes = Math.floor(remainingSeconds / 60)
							.toString()
							.padStart(2, '0');
						const seconds = (remainingSeconds % 60).toString().padStart(2, '0');

						recordingTime = `${hours}:${minutes}:${seconds}`;
					}
				}, 1000);
			} catch (err) {
				console.error(err);
			}
		} else {
			recorder.stop();
			if (interval) clearInterval(interval);
		}
	}

	$: if (stream && showPreview && video) {
		video.srcObject = stream;
	}
</script>

<div class="flex size-full items-center justify-center">
	<div class="grid w-[31rem] grid-cols-2 gap-4">
		<div class="rounded-4xl border-black-800 relative col-span-full aspect-video border p-2">
			<div
				data-recording={recording}
				class="border-black-800 bg-black-900 group absolute -right-4 -top-4 z-20 flex aspect-square size-16 items-center justify-center rounded-full border transition-transform duration-300 data-[recording=true]:rounded-2xl"
			>
				<button
					class="bg-red flex size-12 rounded-full transition-transform duration-300 group-data-[recording=true]:rounded-2xl"
					on:click={handleRecording}
				/>
			</div>
			{#if recording}
				<div
					class="bg-black-900/40 absolute inset-0 z-10 grid size-full place-content-center text-7xl font-black"
				>
					{recordingTime}
				</div>
			{/if}
			<video
				bind:this={video}
				autoplay
				muted
				class="rounded-4xl pointer-events-none size-full appearance-none object-cover"
			/>
		</div>
		<div class="col-span-full grid grid-cols-4 gap-4">
			<IconButton on:click={shareScreen}>
				<ShareIcon />
			</IconButton>
			<IconButton on:click={() => {}}>
				<MicOnIcon />
			</IconButton>
			<IconButton on:click={handleDownload}>
				<DownloadIcon />
			</IconButton>
			<IconButton on:click={() => {}}>
				<SettingsIcon />
			</IconButton>
		</div>
	</div>
</div>
