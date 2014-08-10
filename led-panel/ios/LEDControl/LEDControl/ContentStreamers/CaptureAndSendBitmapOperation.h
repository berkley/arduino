//
//  CaptureAndSendBitmapOperation.h
//  Bitmapper
//
//  Created by P. Mark Anderson on 7/29/14.
//  Copyright (c) 2014 P. Mark Anderson. All rights reserved.
//

#import <Foundation/Foundation.h>

@protocol CaptureAndSendBitmapOperationDelegate <NSObject>
- (void)frameCaptureComplete:(NSArray*)bitmap;
@end

@interface CaptureAndSendBitmapOperation : NSOperation

@property (assign, nonatomic) id<CaptureAndSendBitmapOperationDelegate> delegate;
@property (nonatomic, weak) UIView *view;
@property (assign, nonatomic) CGFloat left;
@property (assign, nonatomic) CGFloat top;

@end
