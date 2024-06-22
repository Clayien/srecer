<script lang="ts">
	import { browser } from '$app/environment';

	const VIDEO_EXT = 'webm';
	const VIDEO_TYPE = `video/${VIDEO_EXT}`;
	const CODECS = 'codecs=vp9,opus';
	const MIME_TYPE = `${VIDEO_TYPE};${CODECS}`;

	let video: HTMLVideoElement;
	let stream: MediaStream;
	let recorder: MediaRecorder;
	let blobs: Blob[] = [];

	async function startCapture() {
		try {
			const width = window.screen.width;
			const height = window.screen.height;
			const aspect = width / height;
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
			video.style.aspectRatio = String(aspect);
			video.srcObject = stream;
		} catch (err) {
			console.error(err);
		}
	}

	function startRecording() {
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
					blobs.push(e.data);
				}
			};
			recorder.start();
			console.log('Recording started');
		} catch (err) {
			console.error(err);
		}
	}

	function stopRecording() {
		recorder.stop();
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
</script>

<div class="flex h-screen w-screen items-center justify-center bg-[#111] p-4">
	{#if browser}
		<video bind:this={video} autoplay muted class="h-full" />
	{/if}
</div>

<div class="fixed bottom-4 right-4 flex items-center justify-end gap-2">
	<button
		class="grid aspect-square size-14 place-content-center rounded-full bg-blue-500"
		on:click={startCapture}
	>
		Share
	</button>
	<button
		class="grid aspect-square size-14 place-content-center rounded-full bg-blue-500"
		on:click={startRecording}
	>
		Record
	</button>
	<button
		class="grid aspect-square size-14 place-content-center rounded-full bg-blue-500"
		on:click={stopRecording}
	>
		Stop
	</button>
	<button
		class="grid aspect-square size-14 place-content-center rounded-full bg-blue-500"
		on:click={handleDownload}
	>
		download
	</button>
</div>
