//
//  SWWebSocketViewController.h
//  LEDControl
//
//  Created by P. Mark Anderson on 8/9/14.
//  Copyright (c) 2014 Chad Berkley. All rights reserved.
//

#import <UIKit/UIKit.h>
#import <SocketRocket/SRWebSocket.h>

@interface SWWebSocketViewController : UIViewController <SRWebSocketDelegate>

@property (strong, nonatomic) SRWebSocket *webSocket;

- (void)sendBitmap:(NSArray*)bitmap;

@end
