import type {TRenderAsset} from 'remotion';
import {expect, test} from 'vitest';
import {calculateAssetPositions} from '../assets/calculate-asset-positions';
import {compressAsset} from '../compress-assets';

test('Should compress and uncompress assets', () => {
	const uncompressed: TRenderAsset[] = [
		[
			{
				frame: 0,
				id: 'my-id',
				src: String('x').repeat(1000),
				mediaFrame: 0,
				playbackRate: 1,
				type: 'video' as const,
				volume: 1,
				allowAmplificationDuringRender: false,
			},
		],
		[
			{
				frame: 1,
				id: 'my-id',
				src: String('x').repeat(1000),
				mediaFrame: 0,
				playbackRate: 1,
				type: 'video' as const,
				volume: 1,
				allowAmplificationDuringRender: false,
			},
		],
	].flat(1);

	const compressedAssets = uncompressed.map((asset, i) => {
		return compressAsset(uncompressed.slice(0, i), asset);
	});

	expect(compressedAssets[0].src).toBe(String('x').repeat(1000));
	expect(compressedAssets[1].src).toBe('same-as-my-id-0');

	const assPos = calculateAssetPositions([compressedAssets]);
	expect(assPos).toEqual([
		{
			duration: 1,
			id: 'my-id',
			playbackRate: 1,
			src: String('x').repeat(1000),
			startInVideo: 0,
			trimLeft: 0,
			type: 'video',
			volume: 1,
			allowAmplificationDuringRender: false,
		},
	]);
});
