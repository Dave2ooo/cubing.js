import type { TimeRange } from "../../../animation/cursor/AlgCursor";
import {
  BoundaryType,
  Direction,
  directionScalar,
  MillisecondTimestamp,
} from "../../../animation/cursor/CursorTypes";
import { RenderScheduler } from "../../../animation/RenderScheduler";
import type {
  PlayingInfo,
  SimpleDirection,
} from "../props/depth-0/PlayingInfoProp";
import type { TwistyPlayerModel } from "../props/TwistyPlayerModel";
import { StaleDropper } from "../props/PromiseFreshener";
import type { CurrentMoveInfo } from "../../../animation/indexer/AlgIndexer";
import type { TimestampRequest } from "../props/depth-0/TimestampRequestProp";

export class TwistyAnimationController {
  // TODO: #private?
  private playing: boolean = false;
  private direction: Direction = Direction.Forwards;

  private model: TwistyPlayerModel;

  private lastDatestamp: MillisecondTimestamp = 0;
  private lastTimestampPromise: Promise<MillisecondTimestamp>;

  private scheduler: RenderScheduler = new RenderScheduler(
    this.animFrame.bind(this),
  );

  constructor(model: TwistyPlayerModel) {
    this.model = model;
    this.lastTimestampPromise = this.#effectiveTimestampMilliseconds();

    this.model.playingInfoProp.addFreshListener(this.onPlayingProp.bind(this)); // TODO
  }

  // TODO: Do we need this?
  async onPlayingProp(playingInfo: PlayingInfo): Promise<void> {
    if (playingInfo.playing !== this.playing) {
      playingInfo.playing ? this.play(playingInfo) : this.pause();
    }
  }

  async #effectiveTimestampMilliseconds(): Promise<MillisecondTimestamp> {
    return (await this.model.detailedTimelineInfoProp.get()).timestamp;
  }

  // TODO: Return the animation we've switched to.
  jumpToStart(): void {
    this.model.timestampRequestProp.set("start");
    this.pause();
  }

  // TODO: Return the animation we've switched to.
  jumpToEnd(): void {
    this.model.timestampRequestProp.set("end");
    this.pause();
  }

  // TODO: Return the playing info we've switched to.
  playPause(): void {
    if (this.playing) {
      this.pause();
    } else {
      this.play();
    }
  }

  // TODO: bundle playing direction, and boundary into `toggle`.
  async play(options?: {
    direction?: SimpleDirection;
    untilBoundary?: BoundaryType;
  }): Promise<void> {
    // TODO: We might need to cache all playing info?
    // if (this.playing) {
    //   return;
    // }

    if ((await this.model.detailedTimelineInfoProp.get()).atEnd) {
      this.model.timestampRequestProp.set("start");
    }
    this.model.playingInfoProp.set({
      playing: true,
      direction: options?.direction ?? Direction.Forwards,
      untilBoundary: options?.untilBoundary ?? BoundaryType.EntireTimeline,
    });

    this.playing = true;
    this.lastDatestamp = performance.now(); // TODO: Take from event.
    this.lastTimestampPromise = this.#effectiveTimestampMilliseconds();

    // TODO: Save timestamp from model?
    this.scheduler.requestAnimFrame();
  }

  pause(): void {
    this.playing = false;
    this.scheduler.cancelAnimFrame();
    this.model.playingInfoProp.set({
      playing: false,
      untilBoundary: BoundaryType.EntireTimeline,
    });
  }

  #animFrameEffectiveTimestampStaleDropper: StaleDropper<
    [PlayingInfo, MillisecondTimestamp, TimeRange, number, CurrentMoveInfo]
  > = new StaleDropper<
    [PlayingInfo, MillisecondTimestamp, TimeRange, number, CurrentMoveInfo]
  >();

  async animFrame(frameDatestamp: MillisecondTimestamp): Promise<void> {
    if (this.playing) {
      this.scheduler.requestAnimFrame();
    }

    const lastDatestamp = this.lastDatestamp;
    const freshenerResult =
      await this.#animFrameEffectiveTimestampStaleDropper.queue(
        Promise.all([
          this.model.playingInfoProp.get(),
          this.lastTimestampPromise,
          this.model.timeRangeProp.get(),
          this.model.tempoScaleProp.get(),
          this.model.currentLeavesProp.get(),
        ]),
      );

    const [playingInfo, lastTimestamp, timeRange, tempoScale, currentMoveInfo] =
      freshenerResult;

    // TODO: Get this without wasting time on the others?
    if (playingInfo.playing === false) {
      this.playing = false;
      // TODO: Ideally we'd cancel the anim frame from the top of this method.
      // But `this.scheduler.cancelAnimFrame();` might accidentally cancel a
      // legit freshly scheduled frame. We should modify `RenderScheduler` to
      // either have individually cancellable requests, or to have something
      // like a "default" anim frame re-request that can be canceled separately.
      //
      // Note that we can't wait until here to call
      // `this.scheduler.requestAnimFrame();`, because that would slow down the
      // frame rate.
      return;
    }

    let end = currentMoveInfo.earliestEnd; // timeRange.end
    if (
      currentMoveInfo.currentMoves.length === 0 ||
      playingInfo.untilBoundary === BoundaryType.EntireTimeline
    ) {
      end = timeRange.end;
    }

    let start = currentMoveInfo.latestStart; // timeRange.end
    if (
      currentMoveInfo.currentMoves.length === 0 ||
      playingInfo.untilBoundary === BoundaryType.EntireTimeline
    ) {
      start = timeRange.start;
    }
    // const start = currentMoveInfo.latestStart; // timeRange.start // TODO

    let delta =
      (frameDatestamp - lastDatestamp) *
      directionScalar(this.direction) *
      tempoScale;
    delta = Math.max(delta, 1); // TODO: This guards against the timestamp going in the wrong direction by accident. Can we avoid it?
    delta *= playingInfo.direction;
    let newTimestamp = lastTimestamp + delta; // TODO: Pre-emptively clamp.
    let newTimestampRequest: TimestampRequest = newTimestamp; // TODO: Pre-emptively clamp.

    if (newTimestamp >= end) {
      newTimestamp = end;
      if (newTimestamp === timeRange.end) {
        newTimestampRequest = "end"; // TODO: Only for EntireTimeline
      }
      this.playing = false;
      this.model.playingInfoProp.set({
        playing: false,
      });
    } else if (newTimestamp <= start) {
      newTimestamp = start;
      if (newTimestamp === timeRange.start) {
        newTimestampRequest = "start"; // TODO: Only for EntireTimeline
      }
      this.playing = false;
      this.model.playingInfoProp.set({
        playing: false,
      });
    }
    this.lastDatestamp = frameDatestamp;
    this.lastTimestampPromise = Promise.resolve(newTimestamp); // TODO: Save this earlier? / Do we need to worry about the effecitve timestamp disagreeing?
    this.model.timestampRequestProp.set(newTimestampRequest);
  }
}
