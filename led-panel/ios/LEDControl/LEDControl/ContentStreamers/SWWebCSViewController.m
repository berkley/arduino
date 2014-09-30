//
//  SWWebCSViewController.m
//  LEDControl
//
//  Created by P. Mark Anderson on 8/20/14.
//  Copyright (c) 2014 Chad Berkley. All rights reserved.
//

#import "SWWebCSViewController.h"


#define TIMER_MIN_INTERVAL 5
#define TIMER_MAX_INTERVAL 30

@interface SWWebCSViewController ()
{
    NSArray *things;
}
@end

@implementation SWWebCSViewController

- (void)viewDidLoad
{
    [super viewDidLoad];

    self.webView = [[UIWebView alloc] initWithFrame:self.streamedContentArea.bounds];
    self.webView.delegate = self;
    CGRect f = self.webView.frame;
//    f.origin.x = -f.size.width / 2;
    self.webView.frame = f;
    [self addContentView:self.webView];

    things = @[
               @"Clock",
               @"GeoRainbow",
               @"Hexbins",
//               @"Icosahedron",
               @"OMGParticles2",
//               @"PMABubbles",
//               @"PMASpiral",
//               @"RainbowWorm",
//               @"Spermatazoa",
//               @"AudioParticles",
//               @"Countdown",
               ];
}

- (void)webViewDidFinishLoad:(UIWebView *)webView {
    NSLog(@"webview did finish load");
    [self performSelector:@selector(startCapturing) withObject:nil afterDelay:1.0];
    
    
}

- (void)webViewDidStartLoad:(UIWebView *)webView {
    NSLog(@"webview did start load");
}

- (void)webView:(UIWebView *)webView didFailLoadWithError:(NSError *)error {
    NSLog(@"webview fail: %@", error);
}

- (BOOL)webView:(UIWebView *)webView shouldStartLoadWithRequest:(NSURLRequest *)request navigationType:(UIWebViewNavigationType)navigationType
{
    NSLog(@"should start load: %@", request);
    return YES;
}

- (void)timerTick {
    [self loadRandomThing];

}

- (void)newTimer {
    CGFloat timerInterval = (arc4random() % TIMER_MAX_INTERVAL) + TIMER_MIN_INTERVAL;
    [NSTimer scheduledTimerWithTimeInterval:timerInterval
                                     target:self
                                   selector:@selector(timerTick)
                                   userInfo:nil
                                    repeats:NO];

}

- (void)loadRandomThing {
    NSInteger index = arc4random() & ([things count]-1);
    self.thingName = [things objectAtIndex:index];
    [self loadLocalWebPage:self.thingName];
}

- (void)viewDidAppear:(BOOL)animated {
    [super viewDidAppear:animated];
    
    if ([self.thingName rangeOfString:@"Shuffle"].location != NSNotFound) {
        [self timerTick];
        [self newTimer];
    }
    else if ([self.thingName rangeOfString:@"Random"].location != NSNotFound) {
        [self loadRandomThing];
    }
    else {
        [self loadLocalWebPage:self.thingName];
    }
}

- (void)loadLocalWebPage:(NSString*)name
{
    NSLog(@"loading thing: %@", name);
    NSAssert(name, @"no thing name");
    NSURL *url = [[NSBundle mainBundle] URLForResource:name withExtension:@".html"];
    NSAssert(url, @"no thing url");
    NSString *html = [NSString stringWithContentsOfURL:url encoding:NSUTF8StringEncoding error:nil];
    NSLog(@"base: %@", [url URLByDeletingLastPathComponent]);
    [self.webView loadHTMLString:html baseURL:[url URLByDeletingLastPathComponent]];
    
}

- (void)loadStuff {
    
    
}

- (void)webViewDidFinishLoad:(UIWebView *)webView {
    NSLog(@"webview did finish load");
//    [self performSelector:@selector(onLoad) withObject:nil afterDelay:0.75];
}

- (void)webViewDidStartLoad:(UIWebView *)webView {
    NSLog(@"webview did start load");
}

- (void)webView:(UIWebView *)webView didFailLoadWithError:(NSError *)error {
    NSLog(@"webview fail: %@", error);
}

- (void)viewDidAppear:(BOOL)animated {
    [super viewDidAppear:animated];
    [self loadStuff];
}

- (void)loadLocalWebPage:(NSString*)name
{
    
    NSURL *url = [[NSBundle mainBundle] URLForResource:name withExtension:@"html"];
    NSString *html = [NSString stringWithContentsOfURL:url encoding:NSUTF8StringEncoding error:nil];
    NSLog(@"base: %@", [url URLByDeletingLastPathComponent]);
    [self.webView loadHTMLString:html baseURL:[url URLByDeletingLastPathComponent]];
    
}

- (void)loadStuff {
    // omg particles 2
//    [self.webView loadRequest:[NSURLRequest requestWithURL:[NSURL URLWithString:@"http://bl.ocks.org/mbostock/raw/9539958/"]]];
//    [self loadLocalWebPage:@"omg-particles-2"];
//    [self loadLocalWebPage:@"icosahedron"];
//    [self loadLocalWebPage:@"pma-bubbles"];
//    [self loadLocalWebPage:@"pma-spiral"];
//    [self loadLocalWebPage:@"countdown"];
//    [self loadLocalWebPage:@"geo-rainbow"];
//    [self loadLocalWebPage:@"clock"];
<<<<<<< HEAD
//    [self loadLocalWebPage:@"hexbins"];
=======
    [self loadLocalWebPage:@"hexbins"];
>>>>>>> 16750a0899500cbfe690fdd425778a06c9a8b235
//    [self loadLocalWebPage:@"spermatazoa"];
    
    // clock
//    [self.webView loadRequest:[NSURLRequest requestWithURL:[NSURL URLWithString:@"http://bl.ocks.org/mbostock/raw/10685278/"]]];
    
    // gears
    //    [self.webView loadRequest:[NSURLRequest requestWithURL:[NSURL URLWithString:@"http://bl.ocks.org/mbostock/raw/10395901/"]]];
    
    // hexbins
//    [self.webView loadRequest:[NSURLRequest requestWithURL:[NSURL URLWithString:@"http://bl.ocks.org/mbostock/raw/7833311/"]]];
    
    
    
    // pma bubbles
    //    [self.webView loadRequest:[NSURLRequest requestWithURL:[NSURL URLWithString:@"http://bl.ocks.org/pmark/raw/8044832/"]]];
    
    
    // countdown
    // http://bl.ocks.org/mbostock/9843633
    
    
    // rotating icosahedron
    //    http://bl.ocks.org/mbostock/raw/7782500/
    
    
    // spiraly particles
    // http://bl.ocks.org/pmark/raw/7916621/
    
    
    // geodesic rainbow
    // http://bl.ocks.org/mbostock/raw/3057239/
    
    // geodesic grid
    // http://bl.ocks.org/mbostock/raw/3058685/
    
    // icosahedron
    // http://bl.ocks.org/mbostock/raw/3061181/
    
    // one-way markers
    // http://bl.ocks.org/mbostock/raw/4965670/
    
    // rotating voronoi
    // http://bl.ocks.org/mbostock/raw/4636377/
    
    
    // rainbow worm
    // http://bl.ocks.org/mbostock/raw/4165404/
    
    // orthographic shading
    // http://bl.ocks.org/mbostock/raw/3031319/
    
    // spermatazoa
    // http://bl.ocks.org/mbostock/raw/1136236/
    
    // polar clock
    // http://bl.ocks.org/mbostock/raw/1096355/
    
}

- (void)onLoad {
    
//    NSString *js = @"var meta = document.createElement('meta'); meta.name='viewport'; meta.content='user-scalable=0; width=320'; document.getElementsByTagName('head')[0].appendChild(meta);";
//
//    NSString *js = @"$('head').append('<meta name='viewport' content='width=device-width; initial-scale=1.0; maximum-scale=1.0; user-scalable=0;'>');";
//    
//    [self.webView stringByEvaluatingJavaScriptFromString:js];
    
}

- (IBAction)moreButtonWasTapped:(id)sender {
}

- (IBAction)closeButtonWasTapped:(id)sender {
    self.closing = YES;
    [self dismissViewControllerAnimated:YES completion:nil];
}

- (void)viewWillDisappear:(BOOL)animated
{
    [super viewWillDisappear:animated];
}

@end
