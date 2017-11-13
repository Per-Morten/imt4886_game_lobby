// Fill out your copyright notice in the Description page of Project Settings.

#pragma once

#include "CoreMinimal.h"
#include "GameFramework/Actor.h"
#include "Runtime/Online/HTTP/Public/Http.h"
#include "HttpActor.generated.h"

USTRUCT(BlueprintType)
struct FGameData
{
	GENERATED_BODY()

public:
	UPROPERTY(BlueprintReadWrite, Category = "FGameData")
		FString Id;

	UPROPERTY(BlueprintReadWrite, Category = "FGameData")
		FString GameToken;

	UPROPERTY(BlueprintReadWrite, Category = "FGameData")
		FString Name;

	UPROPERTY(BlueprintReadWrite, Category = "FGameData")
		FString HostIP;

	UPROPERTY(BlueprintReadWrite, Category = "FGameData")
		int HostPort;

	UPROPERTY(BlueprintReadWrite, Category = "FGameData")
		int VersionNumber;

	UPROPERTY(BlueprintReadWrite, Category = "FGameData")
		FString LastModified;

	UPROPERTY(BlueprintReadWrite, Category = "FGameData")
		FString MiscInfo;

	UPROPERTY(BlueprintReadWrite, Category = "FGameData")
		int MaxPlayerCount;

	UPROPERTY(BlueprintReadWrite, Category = "FGameData")
		int PlayerCount;

	UPROPERTY(BlueprintReadWrite, Category = "FGameData")
		int Status;
};

USTRUCT(BlueprintType)
struct FNewMatchData
{
	GENERATED_BODY()

public:
	UPROPERTY(BlueprintReadWrite, Category = "FGameData")
		FString Name;

	UPROPERTY(BlueprintReadWrite, Category = "FGameData")
		FString GameToken;

	UPROPERTY(BlueprintReadWrite, Category = "FGameData")
		FString HostIP;

	UPROPERTY(BlueprintReadWrite, Category = "FGameData")
		int HostPort;

	UPROPERTY(BlueprintReadWrite, Category = "FGameData")
		int MaxPlayerCount;
};

UCLASS()
class GAMELOBBY_API AHttpActor : public AActor
{
	GENERATED_BODY()
	
public:	
	FHttpModule* Http;

	const FString GameToken = TEXT("59ec8bba890cd692461bb7d3");

	// Sets default values for this actor's properties
	AHttpActor();

	// The http calls
	UFUNCTION()
	void HttpGetAllMatches();

	UFUNCTION()
	void HttpGetAllNonFullMatches();

	UFUNCTION()
	void HttpGetAllMatchesInSession();

	UFUNCTION()
	void HttpGetAllMatchesNotInSession();

	UFUNCTION()
	void HttpGetMatchById(FString MatchName);

	UFUNCTION()
	void HttpCreateMatch(FNewMatchData MatchData);

	UFUNCTION()
	void HttpDeleteMatch(FString MatchId);

	UFUNCTION()
	void HttpUpdatePlayerCount(FString MatchId, int NewPlayerCount);

	UFUNCTION()
	void HttpUpdateMatchStatus(FString MatchId, int MatchStatus);

	UFUNCTION()
	void HttpSendMatchReport(FString MatchId, FString MatchReport);

protected:
	// Assign these functions to call when the http requests processes sucessfully
	void OnHttpGetResponseReceived(FHttpRequestPtr Request, FHttpResponsePtr Response, bool bWasSuccessful);
	void OnHttpGetMatchResponseRecived(FHttpRequestPtr Request, FHttpResponsePtr Response, bool bWasSuccessful);
	void OnHttpCreateMatchResponseRecived(FHttpRequestPtr Request, FHttpResponsePtr Response, bool bWasSuccessful);
	void OnHttpDeleteMatchResponseRecived(FHttpRequestPtr Request, FHttpResponsePtr Response, bool bWasSuccessful);
	void OnHttpUpdatePlayerCountResponseRecived(FHttpRequestPtr Request, FHttpResponsePtr Response, bool bWasSuccessful);
	void OnHttpUpdateMatchStatusResponseRecived(FHttpRequestPtr Request, FHttpResponsePtr Response, bool bWasSuccessful);
	void OnHttpSendMatchReportResponseRecived(FHttpRequestPtr Request, FHttpResponsePtr Response, bool bWasSuccessful);

	// Called when the game starts or when spawned
	virtual void BeginPlay() override;

public:	
	// Called every frame
	virtual void Tick(float DeltaTime) override;

	
	
};
