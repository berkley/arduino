//
//  CaptureAndSendBitmapOperation.m
//  Bitmapper
//
//  Created by P. Mark Anderson on 7/29/14.
//  Copyright (c) 2014 P. Mark Anderson. All rights reserved.
//

#import "CaptureAndSendBitmapOperation.h"

const short WIDTH = 48;
const short HEIGHT = 24;
const short X_STEP = 10;
const short Y_STEP = 10;

@interface CaptureAndSendBitmapOperation ()
{
    CGFloat _xStep;
    CGFloat _yStep;
    size_t _wFrame;
    size_t _hFrame;
    unsigned char *_frameData;
}
@end


@implementation CaptureAndSendBitmapOperation

- (void)main {
    
    NSArray *bitmap = nil;
    @try {
        [self captureViewToFrameData];
        
        NSMutableArray *cols = [NSMutableArray arrayWithCapacity:WIDTH];
        
        for (int col=0; col < WIDTH; col++) {
            NSMutableArray *colColors = [NSMutableArray arrayWithCapacity:HEIGHT];
            
            for (int row=0; row < HEIGHT; row++) {
                CGPoint point = CGPointMake(self.left + (col * X_STEP),
                                            self.top + (row * Y_STEP));
                
                [colColors addObject:[self getPixelColorRGBNumberArrayAtLocation:point]];
            }
            
            [cols addObject:colColors];
        }

        bitmap = cols;
//        [self jsonStringify:cols error:nil];
        
    }
    @catch (NSException *exception) {
        NSLog(@"Error: %@", exception);
    }
    @finally {
    }
    
    [self.delegate frameCaptureComplete:bitmap];
    self.delegate = nil;
}

- (NSString*)jsonStringify:(id)object error:(NSError**)err
{
    if (!object)
    {
        return nil;
    }
    
    NSString *string = nil;
    NSData *data = [NSJSONSerialization dataWithJSONObject:object options:0 error:err];
    
    if (data)
    {
        string = [[NSString alloc] initWithData:data encoding:NSUTF8StringEncoding];
    }
    
    return string;
}

- (UIImage*) imageWithView:(UIView *)view
{
    UIGraphicsBeginImageContext(view.bounds.size);
    [view.layer renderInContext:UIGraphicsGetCurrentContext()];
    UIImage *img = UIGraphicsGetImageFromCurrentImageContext();
    UIGraphicsEndImageContext();
    return img;
}

- (void)captureViewToFrameData
{
    // Free image data memory for the context
    if (_frameData) { free(_frameData); }
    
    CGImageRef inImage;
    
    inImage = [self imageWithView:self.view].CGImage;
    
    // Create off screen bitmap context to draw the image into. Format ARGB is 4 bytes for each pixel: Alpa, Red, Green, Blue
    CGContextRef cgctx = [self createARGBBitmapContextFromImage:inImage];
    if (cgctx == NULL) {
        /* error */
        _frameData = NULL;
        return;
    }
    
    _wFrame = CGImageGetWidth(inImage);
    _hFrame = CGImageGetHeight(inImage);
    CGRect rect = {{0,0},{_wFrame, _hFrame}};
    
    
    // Draw the image to the bitmap context. Once we draw, the memory
    // allocated for the context for rendering will then contain the
    // raw image data in the specified color space.
    CGContextDrawImage(cgctx, rect, inImage);
    
    // Now we can get a pointer to the image data associated with the bitmap
    // context.
    _frameData = CGBitmapContextGetData (cgctx);
}


- (NSString*) getPixelColorRGBStringAtLocation:(CGPoint)point {
    NSString* color = nil;
    
    if (_frameData != NULL) {
        //offset locates the pixel in the data from x,y.
        //4 for 4 bytes of data per pixel, w is width of one row of data.
        int offset = 4*((_wFrame*round(point.y))+round(point.x));
        //        alpha =  _frameData[offset];
        int red = _frameData[offset+1];
        int green = _frameData[offset+2];
        int blue = _frameData[offset+3];
        color = [NSString stringWithFormat:@"%i,%i,%i", red, green, blue];
    }
    
    if (!color) {
        color = @"0,0,0";
    }
    
    // When finished, release the context
    //CGContextRelease(cgctx);
    
    return color;
}

- (NSArray*) getPixelColorRGBNumberArrayAtLocation:(CGPoint)point {
    NSArray* color = nil;
    
    if (_frameData != NULL) {
        //offset locates the pixel in the data from x,y.
        //4 for 4 bytes of data per pixel, w is width of one row of data.
        int offset = 4*((_wFrame*round(point.y))+round(point.x));
        //        alpha =  _frameData[offset];
        int red = _frameData[offset+1];
        int green = _frameData[offset+2];
        int blue = _frameData[offset+3];
        color = [NSArray arrayWithObjects:
                 [NSNumber numberWithInteger:red],
                 [NSNumber numberWithInteger:green],
                 [NSNumber numberWithInteger:blue],
                 nil];
    }
    
    if (!color) {
        color = @[];
    }
    
    // When finished, release the context
    //CGContextRelease(cgctx);
    
    return color;
}

- (CGContextRef) createARGBBitmapContextFromImage:(CGImageRef)inImage
{
    CGContextRef    context = NULL;
    CGColorSpaceRef colorSpace;
    void *          bitmapData;
    int             bitmapByteCount;
    int             bitmapBytesPerRow;
    
    // Get image width, height. We'll use the entire image.
    size_t pixelsWide = CGImageGetWidth(inImage);
    size_t pixelsHigh = CGImageGetHeight(inImage);
    
    // Declare the number of bytes per row. Each pixel in the bitmap in this
    // example is represented by 4 bytes; 8 bits each of red, green, blue, and
    // alpha.
    bitmapBytesPerRow   = (pixelsWide * 4);
    bitmapByteCount     = (bitmapBytesPerRow * pixelsHigh);
    
    // Use the generic RGB color space.
    colorSpace = CGColorSpaceCreateDeviceRGB();
    
    if (colorSpace == NULL)
    {
        fprintf(stderr, "Error allocating color space\n");
        return NULL;
    }
    
    // Allocate memory for image data. This is the destination in memory
    // where any drawing to the bitmap context will be rendered.
    bitmapData = malloc( bitmapByteCount );
    if (bitmapData == NULL)
    {
        fprintf (stderr, "Memory not allocated!");
        CGColorSpaceRelease( colorSpace );
        return NULL;
    }
    
    // Create the bitmap context. We want pre-multiplied ARGB, 8-bits
    // per component. Regardless of what the source image format is
    // (CMYK, Grayscale, and so on) it will be converted over to the format
    // specified here by CGBitmapContextCreate.
    context = CGBitmapContextCreate (bitmapData,
                                     pixelsWide,
                                     pixelsHigh,
                                     8,      // bits per component
                                     bitmapBytesPerRow,
                                     colorSpace,
                                     kCGImageAlphaPremultipliedFirst);
    if (context == NULL)
    {
        free (bitmapData);
        fprintf (stderr, "Context not created!");
    }
    
    // Make sure and release colorspace before returning
    CGColorSpaceRelease( colorSpace );
    
    return context;
}

@end
