//
//  SWWaveFlickrViewController.h
//  LEDControl
//
//  Created by Chad Berkley on 8/15/14.
//  Copyright (c) 2014 Chad Berkley. All rights reserved.
//

#import <UIKit/UIKit.h>
#import <SocketRocket/SRWebSocket.h>
#import "SWLEDController.h"

@interface SWWaveFlickrViewController : UIViewController <UIGestureRecognizerDelegate, SRWebSocketDelegate>

@property (weak, nonatomic) IBOutlet UIView *mainView;
@property (strong, nonatomic) IBOutlet UIPanGestureRecognizer *panGestureRecognizer;
@property (strong, nonatomic) IBOutlet UITapGestureRecognizer *tapGestureRecognizer;
@property (strong, nonatomic) IBOutlet UISwipeGestureRecognizer *swipeGestureRecognizer;
@property (strong, nonatomic) SRWebSocket *webSocket;

@end

