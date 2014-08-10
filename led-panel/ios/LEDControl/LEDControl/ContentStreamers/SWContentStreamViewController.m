//
//  SWContentStreamViewController.m
//  LEDControl
//
//  Created by P. Mark Anderson on 8/9/14.
//  Copyright (c) 2014 Chad Berkley. All rights reserved.
//

#import "SWContentStreamViewController.h"

const CGFloat SEC_PER_FRAME = (1.0/24);  // 24 is good

@interface SWContentStreamViewController ()
{
    NSTimeInterval _lastCaptureAt;
    NSOperationQueue *_opQueue;
    CGFloat _left;
    CGFloat _top;
}
@end

@implementation SWContentStreamViewController

- (void)viewDidLoad
{
    [super viewDidLoad];
    self.view.backgroundColor = [UIColor blackColor];

#if 0
    // formatted for portrait
    CGFloat h = 480;
    CGFloat w = 240;
    CGFloat x = (self.view.bounds.size.width - w) / 2;
    CGFloat y = (self.view.bounds.size.height - h) / 2 + 32;
    CGAffineTransform xfm = CGAffineTransformIdentity;
#else
    // rotated
    CGFloat w = 480;
    CGFloat h = 240;
    CGFloat x = (self.view.bounds.size.width - w) / 2;
    CGFloat y = (self.view.bounds.size.height - h) / 2 + 32;
    CGAffineTransform xfm = CGAffineTransformMakeRotation(M_PI_2);
#endif
    
    self.streamedContentArea = [[UIView alloc] initWithFrame:CGRectMake(x, y, w, h)];
    self.streamedContentArea.layer.borderColor = [UIColor colorWithWhite:1.0 alpha:0.25].CGColor;
    self.streamedContentArea.layer.borderWidth = 3.0;
    self.streamedContentArea.layer.cornerRadius = 2;
    self.streamedContentArea.transform = xfm;
    [self.view addSubview:self.streamedContentArea];
    
    _left = self.streamedContentArea.frame.origin.x + self.streamedContentArea.frame.size.width;
    _top = self.streamedContentArea.frame.origin.y;
    
    _opQueue = [[NSOperationQueue alloc] init];

}

- (void)viewDidAppear:(BOOL)animated
{
    [super viewDidAppear:animated];
    
    _lastCaptureAt = CACurrentMediaTime();
    [self captureFrame];
    
}


- (void)addContentView:(UIView*)v
{
    v.transform = self.streamedContentArea.transform;
    [self.streamedContentArea addSubview:v];
}

- (void)frameCaptureComplete:(NSArray*)bitmap
{
    
    //    [self captureFrame];
    //    [self performSelector:@selector(captureFrame) withObject:nil afterDelay:wait];

    [self sendBitmap:bitmap];
    [self performSelectorInBackground:@selector(captureFrame) withObject:nil];
}

- (void)captureFrame
{
    CFTimeInterval now = CACurrentMediaTime();
    CFTimeInterval delta = (now - _lastCaptureAt);
    
    // Wait at least SEC_PER_FRAME before processing another frame.
    CFTimeInterval wait = (SEC_PER_FRAME - delta);
//    NSLog(@"delta %.4f, wait %.4f\n\n", delta, wait);
    
    if (wait < 0.0) {
        wait = 0.0;
    }
    
    [NSThread sleepForTimeInterval:wait];
    _lastCaptureAt = CACurrentMediaTime();
    
    CaptureAndSendBitmapOperation *op = [[CaptureAndSendBitmapOperation alloc] init];
    op.delegate = self;
    op.view = self.view;
    op.left = _left;
    op.top = _top;
    [_opQueue addOperation:op];
}


@end
