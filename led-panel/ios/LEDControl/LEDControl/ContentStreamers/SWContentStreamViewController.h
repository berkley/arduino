//
//  SWContentStreamViewController.h
//  LEDControl
//
//  Created by P. Mark Anderson on 8/9/14.
//  Copyright (c) 2014 Chad Berkley. All rights reserved.
//

#import <UIKit/UIKit.h>
#import "SWWebSocketViewController.h"
#import "CaptureAndSendBitmapOperation.h"

@interface SWContentStreamViewController : SWWebSocketViewController <CaptureAndSendBitmapOperationDelegate>

@property (strong, nonatomic) UIView *streamedContentArea;
- (void)addContentView:(UIView*)v;

@end
